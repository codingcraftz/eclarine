'use client';

import { useRef, useState } from 'react';

import { LoadingOverlay, copyText, GOLD } from '@/components/ui/ecla-ui';
import { formatKRW } from '@/lib/pricing';

const onlyDigits = (s) => String(s).replace(/\D/g, '');
const withComma = (s) => (s ? Number(s).toLocaleString('ko-KR') : '');

// 옵션 ±는 음수 허용 (예: -1000)
const signedInt = (s) => {
  const cleaned = String(s).replace(/[^\d-]/g, '');
  return (cleaned.startsWith('-') ? '-' : '') + cleaned.replace(/-/g, '');
};
const withCommaSigned = (s) => {
  if (s === '' || s === '-') return s;
  const n = Number(s);
  return Number.isFinite(n) ? n.toLocaleString('ko-KR') : '';
};

const EMPTY_OPTION = () => ({ label: '', cashAdd: '', cardAdd: '', imageUrl: null, file: null, preview: '' });

// 업로드 전 클라이언트 압축 — 로딩 속도와 저장 용량을 함께 줄인다
async function compressImage(file, max = 1600, quality = 0.85) {
  if (!file?.type?.startsWith('image/')) return file;
  try {
    const img = await createImageBitmap(file);
    const r = Math.min(max / img.width, max / img.height, 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * r);
    canvas.height = Math.round(img.height * r);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    img.close?.();

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

export default function ProductManager({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [cardPrice, setCardPrice] = useState('');
  const [shipping, setShipping] = useState('');
  const [cardShipping, setCardShipping] = useState('');
  const [options, setOptions] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null); // 삭제는 두 번 눌러 확인
  const [formErr, setFormErr] = useState('');
  const [toast, setToast] = useState('');
  const fileRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  };

  const pickCover = async (e) => {
    const raw = e.target.files?.[0] || null;
    const f = raw ? await compressImage(raw) : null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const updateOption = (i, key, val) =>
    setOptions((prev) =>
      prev.map((o, idx) => (idx === i ? { ...o, [key]: key === 'label' ? val : signedInt(val) } : o))
    );

  const setOptionImage = async (i, raw) => {
    const f = raw ? await compressImage(raw) : null;
    setOptions((prev) =>
      prev.map((o, idx) => (idx === i ? { ...o, file: f, preview: f ? URL.createObjectURL(f) : '' } : o))
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setListPrice('');
    setCardPrice('');
    setShipping('');
    setCardShipping('');
    setOptions([]);
    setFile(null);
    setPreview('');
    setFormErr('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(String(p.price ?? ''));
    setListPrice(p.listPrice ? String(p.listPrice) : '');
    setCardPrice(p.cardPrice ? String(p.cardPrice) : '');
    setShipping(p.shippingFee ? String(p.shippingFee) : '');
    setCardShipping(p.cardShippingFee ? String(p.cardShippingFee) : '');
    setOptions(
      (p.options || []).map((o) => ({
        label: o.label,
        cashAdd: o.cashAdd ? String(o.cashAdd) : '',
        cardAdd: o.cardAdd ? String(o.cardAdd) : '',
        imageUrl: o.imageUrl || null,
        file: null,
        preview: '',
      }))
    );
    setFile(null);
    setPreview('');
    setFormErr('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (e) => {
    e.preventDefault();
    setFormErr('');
    if (!name.trim() || !price) {
      setFormErr('상품명과 현금가를 입력해주세요.');
      return;
    }

    setSaving(true);
    const fd = new FormData();
    if (editingId) fd.append('id', editingId);
    fd.append('name', name.trim());
    fd.append('price', String(Number(price)));
    if (listPrice) fd.append('listPrice', String(Number(listPrice)));
    if (cardPrice) fd.append('cardPrice', String(Number(cardPrice)));
    fd.append('shippingFee', String(Number(shipping) || 0));
    fd.append('cardShippingFee', String(Number(cardShipping) || 0));

    const clean = options.filter((o) => o.label.trim());
    fd.append(
      'options',
      JSON.stringify(
        clean.map((o) => ({
          label: o.label.trim(),
          cashAdd: Number(o.cashAdd) || 0,
          cardAdd: Number(o.cardAdd) || 0,
          imageUrl: o.imageUrl || null,
        }))
      )
    );
    clean.forEach((o, i) => o.file && fd.append(`option_image_${i}`, o.file));
    if (file) fd.append('image', file);

    const res = await fetch('/api/admin/products', { method: 'POST', body: fd });
    setSaving(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setFormErr(json.error || '저장에 실패했어요.');
      return;
    }

    const { product } = await res.json();
    setProducts((prev) => (editingId ? prev.map((x) => (x.id === product.id ? product : x)) : [product, ...prev]));
    resetForm();
    showToast(editingId ? '상품이 수정되었어요.' : '상품이 등록되었어요.');
  };

  const toggleActive = async (p) => {
    const next = !p.active;
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: next } : x)));

    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, active: next }),
    });

    if (!res.ok) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: p.active } : x)));
      showToast('변경에 실패했어요.');
      return;
    }
    showToast(next ? '판매 중으로 켰어요.' : '판매를 중지했어요.');
  };

  const remove = async (p) => {
    if (deleteTarget !== p.id) {
      setDeleteTarget(p.id);
      showToast('한 번 더 누르면 삭제돼요.');
      return;
    }

    setDeleteTarget(null);
    setBusy('삭제 중…');
    const res = await fetch(`/api/admin/products?id=${p.id}`, { method: 'DELETE' });
    setBusy('');
    if (!res.ok) {
      showToast('삭제에 실패했어요.');
      return;
    }
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    showToast('삭제되었어요.');
  };

  const copyLink = (path, label) =>
    copyText(`${window.location.origin}${path}`).then(() => showToast(`${label} 링크를 복사했어요.`));

  return (
    <>
      <div className="mt-5 flex items-start justify-between gap-3">
        <h1 className="text-[20px] font-extrabold tracking-[-0.02em]">
          {editingId ? '상품 수정' : '상품 등록'}
        </h1>
        <button
          onClick={() => copyLink('/shop', '스토어')}
          className="shrink-0 text-[12.5px] font-bold text-white bg-[#1A1A1A] rounded-full px-3.5 py-2"
        >
          스토어 링크 복사
        </button>
      </div>

      <form onSubmit={save} className="mt-3 bg-white rounded-2xl border border-black/[0.07] p-5 flex flex-col gap-4">
        <Field label="상품명">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="올실버 진주토끼 귀걸이" className="pay-input" />
        </Field>

        <Field label="원가 (정가) · 비우면 세일 표시 없음">
          <input
            inputMode="numeric"
            value={withComma(listPrice)}
            onChange={(e) => setListPrice(onlyDigits(e.target.value))}
            placeholder="39,000"
            className="pay-input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="현금가">
            <input
              inputMode="numeric"
              value={withComma(price)}
              onChange={(e) => setPrice(onlyDigits(e.target.value))}
              placeholder="32,000"
              className="pay-input"
            />
          </Field>
          <Field label="카드가 · 비우면 현금가">
            <input
              inputMode="numeric"
              value={withComma(cardPrice)}
              onChange={(e) => setCardPrice(onlyDigits(e.target.value))}
              placeholder="33,000"
              className="pay-input"
            />
          </Field>
          <Field label="현금 배송비 · 0이면 무료">
            <input
              inputMode="numeric"
              value={withComma(shipping)}
              onChange={(e) => setShipping(onlyDigits(e.target.value))}
              placeholder="3,000"
              className="pay-input"
            />
          </Field>
          <Field label="카드 배송비 · 0이면 무료">
            <input
              inputMode="numeric"
              value={withComma(cardShipping)}
              onChange={(e) => setCardShipping(onlyDigits(e.target.value))}
              placeholder="3,000"
              className="pay-input"
            />
          </Field>
        </div>

        <div>
          <label className="block text-[12.5px] font-bold text-[#8A8A8A] mb-2">옵션 (색상 등) · 없으면 비워두세요</label>
          <div className="flex flex-col gap-2">
            {options.map((o, i) => (
              <div key={i} className="flex gap-2 items-center">
                <label className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-black/[0.12] bg-[#FAF8F3] grid place-items-center cursor-pointer">
                  {o.preview || o.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={o.preview || o.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] text-[#B5B5AE]">사진</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setOptionImage(i, e.target.files?.[0] || null)}
                  />
                </label>
                <input
                  value={o.label}
                  onChange={(e) => updateOption(i, 'label', e.target.value)}
                  placeholder="옵션명 (실버)"
                  className="pay-input flex-1 min-w-0 !py-2.5"
                />
                <input
                  value={withCommaSigned(o.cashAdd)}
                  onChange={(e) => updateOption(i, 'cashAdd', e.target.value)}
                  placeholder="현금±"
                  className="pay-input w-20 !px-2 !py-2.5 !text-[13px]"
                />
                <input
                  value={withCommaSigned(o.cardAdd)}
                  onChange={(e) => updateOption(i, 'cardAdd', e.target.value)}
                  placeholder="카드±"
                  className="pay-input w-20 !px-2 !py-2.5 !text-[13px]"
                />
                <button
                  type="button"
                  onClick={() => setOptions((p) => p.filter((_, idx) => idx !== i))}
                  className="shrink-0 text-[18px] text-[#B5B5AE] px-1"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setOptions((p) => [...p, EMPTY_OPTION()])}
              className="self-start text-[13px] font-bold mt-1"
              style={{ color: GOLD }}
            >
              + 옵션 추가
            </button>
            {options.length > 0 && (
              <p className="text-[11.5px] text-[#9A9A95]">±는 기본가 대비 가산·차감액(빈칸=동일). 예: 골드만 +10,000</p>
            )}
          </div>
        </div>

        <Field label={editingId ? '대표 사진 · 비우면 기존 유지' : '대표 사진 · 옵션 사진이 있으면 비워도 돼요'}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={pickCover}
            className="block w-full text-[13px] text-[#4A4A4A] file:mr-3 file:rounded-full file:border-0 file:bg-[#1A1A1A] file:text-white file:px-4 file:py-2 file:text-[13px] file:font-bold"
          />
          {preview && (
            <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border border-black/[0.08] bg-[#FAF8F3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
            </div>
          )}
        </Field>

        {formErr && <p className="text-[13px] font-medium text-[#E85D3A]">{formErr}</p>}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="text-[15px] font-bold text-white bg-[#1A1A1A] rounded-full px-7 py-3 disabled:opacity-50"
          >
            {saving ? '저장 중…' : editingId ? '수정 저장' : '상품 등록'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-[14px] font-semibold text-[#8A8A8A] px-3 py-3">
              취소
            </button>
          )}
        </div>
      </form>

      <h2 className="text-[16px] font-extrabold mt-8 mb-3">
        등록된 상품 {products.length > 0 && <span style={{ color: GOLD }}>{products.length}</span>}
      </h2>

      {products.length === 0 ? (
        <p className="text-[14px] text-[#9A9A95]">아직 등록된 상품이 없어요.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {products.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 bg-white rounded-2xl border border-black/[0.07] p-3.5 ${
                p.active ? '' : 'opacity-60'
              }`}
            >
              <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#F1EEE6]">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-[10px] text-[#B5B5AE]">No image</div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold truncate">{p.name}</div>
                <div className="text-[12.5px] text-[#4A4A4A] mt-0.5">
                  현금 <b style={{ color: GOLD }}>{formatKRW(p.price)}</b> · 카드{' '}
                  <b style={{ color: GOLD }}>{formatKRW(p.cardPrice ?? p.price)}</b>
                </div>
                <div className="text-[11.5px] text-[#9A9A95] mt-0.5">
                  배송 현금 {p.shippingFee > 0 ? formatKRW(p.shippingFee) : '무료'} · 카드{' '}
                  {p.cardShippingFee > 0 ? formatKRW(p.cardShippingFee) : '무료'}
                  {p.options?.length ? ` · 옵션 ${p.options.length}` : ''}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <Toggle on={p.active} onClick={() => toggleActive(p)} />
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-[12px] font-bold rounded-full px-2.5 py-1.5 border"
                    style={{ color: GOLD, borderColor: `${GOLD}55` }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => copyLink(`/pay/${p.id}`, '결제')}
                    className="text-[12px] font-bold text-white bg-[#1A1A1A] rounded-full px-2.5 py-1.5"
                  >
                    링크
                  </button>
                  <button
                    onClick={() => remove(p)}
                    className={`text-[12px] font-semibold px-1.5 py-1.5 ${
                      deleteTarget === p.id ? 'text-[#E85D3A]' : 'text-[#9A9A95]'
                    }`}
                  >
                    {deleteTarget === p.id ? '정말 삭제' : '삭제'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(saving || busy) && <LoadingOverlay label={saving ? '저장 중…' : busy} />}
      {toast && (
        <div className="pay-fade fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] bg-[#1A1A1A] text-white text-[13.5px] font-semibold px-5 py-3 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="판매 상태"
      className="relative w-11 h-6 rounded-full transition-colors"
      style={{ background: on ? GOLD : 'rgba(0,0,0,0.15)' }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[12.5px] font-bold text-[#8A8A8A] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
