'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Copy, ImagePlus, X } from 'lucide-react';

import { EclaMark, LoadingOverlay, copyText, GOLD } from '@/components/ui/ecla-ui';
import { BRAND, formatKRW, tossSendUrl } from '@/lib/pricing';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const TARGET_BYTES = 4 * 1024 * 1024;

// 휴대폰 번호 하이픈 자동 (010-0000-0000)
function formatPhone(s) {
  const d = String(s).replace(/\D/g, '').slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

// 아이폰 HEIC는 canvas가 못 읽으므로 JPEG로 먼저 변환
async function toCanvasReadable(file) {
  if (!/heic|heif/i.test(file.type) && !/\.(heic|heif)$/i.test(file.name)) return file;
  const heic2any = (await import('heic2any')).default;
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
}

// 1600px로 줄이고 목표 용량까지 품질을 낮춘다
async function compress(file) {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1600 / bitmap.width, 1600 / bitmap.height, 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(bitmap.width * ratio);
  canvas.height = Math.floor(bitmap.height * ratio);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.8;
  let blob = await toBlob(canvas, quality);
  while (blob.size > TARGET_BYTES && quality > 0.4) {
    quality -= 0.1;
    blob = await toBlob(canvas, quality);
  }
  return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
}

const toBlob = (canvas, quality) =>
  new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('압축 실패'))), 'image/jpeg', quality)
  );

export default function OrderForm({ account, kakaoChannel }) {
  const [intro, setIntro] = useState(true); // 진입 인사 애니메이션
  const [done, setDone] = useState(null); // 제출 완료 시 결제방법 보관

  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [amount, setAmount] = useState('');
  const [payment, setPayment] = useState('계좌이체');
  const [request, setRequest] = useState('');
  const [photos, setPhotos] = useState([]); // [{ file, preview }]

  const [preparing, setPreparing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  };

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.preview)), [photos]);

  // 진입 인사 — 화면을 누르면 바로 넘어간다
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const openPostcode = () => {
    if (typeof window === 'undefined' || !window.daum?.Postcode) {
      showToast('주소 검색을 불러오는 중이에요.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: (d) => setAddress(d.roadAddress || d.jibunAddress),
    }).open();
  };

  const addPhotos = async (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    if (picked.length === 0) return;

    setPreparing(true);
    setError('');
    const added = [];
    const failed = [];

    for (const file of picked.slice(0, MAX_FILES - photos.length)) {
      if (file.size > MAX_FILE_SIZE) {
        failed.push(`${file.name} (50MB 초과)`);
        continue;
      }
      try {
        const ready = await compress(await toCanvasReadable(file));
        added.push({ file: ready, preview: URL.createObjectURL(ready) });
      } catch {
        failed.push(file.name);
      }
    }

    setPhotos((prev) => [...prev, ...added]);
    setPreparing(false);
    if (failed.length > 0) setError(`이 사진은 올리지 못했어요: ${failed.join(', ')}`);
  };

  const removePhoto = (idx) =>
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });

  const canSubmit =
    nickname.trim() && name.trim() && phone.trim() && address.trim() && Number(amount) > 0 && photos.length > 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      const body = new FormData();
      body.append('nickname', nickname.trim());
      body.append('name', name.trim());
      body.append('phone', phone.trim());
      body.append('address', address.trim());
      body.append('addressDetail', addressDetail.trim());
      body.append('payment', payment);
      body.append('amount', amount);
      body.append('request', request.trim());
      photos.forEach((p) => body.append('files', p.file));

      const res = await fetch('/api/order-form', { method: 'POST', body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || '주문서 제출에 실패했어요.');

      setDone(payment);
    } catch (err) {
      setError(err.message || '주문서 제출에 실패했어요. 잠시 후 다시 시도해 주세요.');
    }
    setSubmitting(false);
  };

  if (intro) {
    return (
      <div
        onClick={() => setIntro(false)}
        className="pay-fade flex-1 flex flex-col items-center justify-center px-8 text-center cursor-pointer"
      >
        <div className="pay-float mb-7" style={{ color: GOLD }}>
          <EclaMark size={52} />
        </div>
        <div className="font-[family-name:var(--font-jakarta)] text-[12px] tracking-[0.42em] uppercase text-[#9A9A95] mb-4">
          ÉCLARINE
        </div>
        <h1 className="text-[19px] font-extrabold tracking-[-0.02em] pay-sheen mb-2">주문해주셔서 감사합니다</h1>
        <p className="text-[13.5px] text-[#9A9A95] leading-relaxed mb-7">
          정성껏 준비해서 보내드릴게요.
          <br />
          잠시 후 주문서가 열려요.
        </p>
        <div className="pay-bar relative w-40 h-[3px] rounded-full bg-black/[0.06] overflow-hidden">
          <span />
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="pay-fade flex-1 flex flex-col justify-center px-7 py-10 text-center">
        <div className="mx-auto mb-6 grid place-items-center w-16 h-16 rounded-full" style={{ background: GOLD }}>
          <EclaMark size={34} className="text-white" />
        </div>
        <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-2">주문서가 접수되었어요</h1>
        <p className="text-[14.5px] text-[#7A7A7A] leading-relaxed">
          소중한 주문 감사합니다.
          <br />
          빠르게 확인 후 안내드릴게요 :)
        </p>
        {done === '카드결제' && <KakaoBox channel={kakaoChannel} className="mt-7 text-left" />}
        <div className="mt-8 font-[family-name:var(--font-jakarta)] text-[12px] tracking-[0.3em] uppercase text-[#B5B5AE]">
          ÉCLARINE
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      <form onSubmit={submit} className="pay-fade flex-1 px-6 py-9">
        <div
          className="font-[family-name:var(--font-jakarta)] text-[10px] tracking-[0.24em] uppercase mb-1.5"
          style={{ color: GOLD }}
        >
          Live Order
        </div>
        <h1 className="text-[21px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-1.5">{BRAND} 주문서</h1>
        <p className="text-[13.5px] text-[#9A9A95] leading-relaxed mb-7">
          정확한 배송을 위해 아래 내용을 꼼꼼히 작성해 주세요.
        </p>

        <div className="flex flex-col gap-4">
          <Field label="유튜브 닉네임" required>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="방송에서 쓰시는 닉네임"
              className="pay-input"
            />
          </Field>

          <Field label="이름" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="받으실 분 성함"
              className="pay-input"
            />
          </Field>

          <Field label="연락처" required>
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              inputMode="numeric"
              placeholder="010-0000-0000"
              className="pay-input"
            />
          </Field>

          <Field label="주소" required>
            <div className="flex gap-2">
              <input
                value={address}
                readOnly
                onClick={openPostcode}
                placeholder="검색 버튼을 눌러 주소를 선택하세요"
                className="pay-input flex-1 cursor-pointer"
              />
              <button
                type="button"
                onClick={openPostcode}
                className="shrink-0 px-4 rounded-xl text-[13px] font-bold text-white bg-[#1A1A1A] active:scale-[0.98] transition-transform"
              >
                주소 검색
              </button>
            </div>
            <input
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              placeholder="상세주소 (동·호수 등)"
              className="pay-input mt-2"
            />
          </Field>

          <Field label="캡쳐사진" required>
            <div className="grid grid-cols-4 gap-2">
              {photos.map((p, i) => (
                <div key={p.preview} className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF8F3]">
                  {/* 로컬 blob 미리보기 — next/image 최적화 대상이 아니다 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white grid place-items-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {photos.length < MAX_FILES && (
                <label className="aspect-square rounded-xl border border-dashed border-black/20 bg-[#FAF8F3] grid place-items-center text-[#B5B5AE] cursor-pointer active:scale-[0.97] transition-transform">
                  <ImagePlus size={20} strokeWidth={1.4} />
                  <input type="file" multiple accept="image/*" onChange={addPhotos} className="hidden" />
                </label>
              )}
            </div>
            <p className="mt-2 text-[12px] text-[#B5B5AE]">
              주문하실 상품 화면을 캡쳐해 올려주세요. 최대 {MAX_FILES}장, 올릴 때 자동으로 용량을 줄입니다.
            </p>
          </Field>

          <Field label="금액" required>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 9))}
              inputMode="numeric"
              placeholder="방송에서 안내받으신 금액"
              className="pay-input"
            />
            {Number(amount) > 0 && (
              <p className="mt-1.5 text-[13px] font-bold" style={{ color: GOLD }}>
                {formatKRW(Number(amount))}
              </p>
            )}
          </Field>

          <Field label="결제 방법" required>
            <div className="flex gap-2">
              {['계좌이체', '카드결제'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPayment(v)}
                  className={`flex-1 rounded-xl border py-3 text-[14px] font-bold transition-colors ${
                    payment === v
                      ? 'border-[#B8A06A] bg-[#FAF8F3] text-[#1A1A1A]'
                      : 'border-black/[0.12] bg-white text-[#9A9A95]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {payment === '계좌이체' ? (
              <AccountBox account={account} name={name} onCopy={showToast} />
            ) : (
              <KakaoBox channel={kakaoChannel} className="mt-3" />
            )}
          </Field>

          <Field label="요청사항">
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              rows={2}
              placeholder="배송 관련 요청이 있으면 적어주세요."
              className="pay-input resize-none"
            />
          </Field>
        </div>

        {error && <p className="mt-4 text-[13px] font-medium text-[#E85D3A]">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="mt-7 w-full text-[16px] font-bold rounded-2xl py-4 text-white transition-transform active:scale-[0.98] disabled:opacity-40"
          style={{ background: canSubmit ? '#1A1A1A' : '#C9C9C2' }}
        >
          주문서 제출
        </button>
        {!canSubmit && (
          <p className="mt-2 text-[12.5px] text-center text-[#B5B5AE]">
            닉네임 · 이름 · 연락처 · 주소 · 사진 · 금액을 입력해 주세요.
          </p>
        )}
      </form>

      {preparing && <LoadingOverlay label="사진 준비 중…" />}
      {submitting && <LoadingOverlay label="주문서 보내는 중…" />}
      {toast && (
        <div className="pay-fade fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-[#1A1A1A] text-white text-[13.5px] font-semibold px-5 py-3 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}

function AccountBox({ account, name, onCopy }) {
  return (
    <div className="mt-3 rounded-2xl p-5 text-white" style={{ background: '#1A1A1A' }}>
      <div
        className="font-[family-name:var(--font-jakarta)] text-[10px] tracking-[0.2em] uppercase mb-3"
        style={{ color: GOLD }}
      >
        Bank Transfer
      </div>
      <div className="text-[13px] text-white/60 mb-1">
        {account.bank} · {account.holder}
      </div>
      <div className="text-[20px] font-extrabold tracking-[0.01em]">{account.number}</div>

      <div className="mt-4 flex gap-2">
        <a
          href={tossSendUrl(account)}
          className="flex-1 text-center text-[14px] font-bold rounded-xl py-2.5"
          style={{ background: '#0064FF', color: '#fff' }}
        >
          토스로 송금
        </a>
        <button
          type="button"
          onClick={() => copyText(account.number).then(() => onCopy('계좌번호가 복사되었어요.'))}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-[14px] font-bold rounded-xl py-2.5"
          style={{ background: GOLD, color: '#1A1A1A' }}
        >
          <Copy size={14} /> 계좌 복사
        </button>
      </div>

      <p className="mt-3 text-[12.5px] text-white/60 leading-relaxed">
        입금자명을 <b className="text-white">{name.trim() || '주문자 성함'}</b> 으로 보내주세요. 토스 앱이 없으면 계좌를
        복사해 이체해 주세요.
      </p>
    </div>
  );
}

function KakaoBox({ channel, className = '' }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{ background: '#FEE500', color: '#3C1E1E' }}>
      <div className="text-[15px] font-extrabold mb-1.5">🟡 카드결제는 카카오톡으로 안내드려요</div>
      <p className="text-[13px] leading-relaxed opacity-80">
        주문서를 제출하신 뒤 아래 버튼으로 <b>에끌라린</b> 카카오톡 채널에 들어와 <b>결제링크 요청</b> 이라고 남겨주세요.
        확인 후 카드결제 링크를 보내드립니다.
      </p>
      <a
        href={channel}
        target="_blank"
        rel="noreferrer"
        className="mt-3.5 block text-center text-[14px] font-bold rounded-xl py-3 bg-[#3C1E1E] text-[#FEE500]"
      >
        카카오톡 채널 열기
      </a>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-[12.5px] font-bold text-[#8A8A8A] mb-1.5">
        {label}
        {required && <span style={{ color: GOLD }}> *</span>}
      </label>
      {children}
    </div>
  );
}
