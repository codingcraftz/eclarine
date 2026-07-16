'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import { Gem, Copy, Plus, Minus, Trash2, ChevronLeft, X } from 'lucide-react';
import { EclaMark, LoadingOverlay, FadeImage, copyText, GOLD } from '@/components/ui/ecla-ui';
import { BRAND, formatKRW, unitPrice, computeTotal, salePercent } from '@/lib/pricing';

const DEFAULT_OPTION = { id: 'default', label: '기본', cashAdd: 0, cardAdd: 0 };

const coverOf = (p) => p.imageUrl || p.options?.find((o) => o.imageUrl)?.imageUrl || null;

// 휴대폰 번호 하이픈 자동 (010-0000-0000)
function formatPhone(s) {
  const d = String(s).replace(/\D/g, '').slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

export default function StoreFlow({ products, preselectedId, account, tossClientKey }) {
  // 단일 상품 화면으로 바로 진입 = 딥링크(/pay/[id])일 때만. /shop 은 항상 목록부터.
  const single = Boolean(preselectedId);
  const preselected = preselectedId ? products.find((p) => p.id === preselectedId) : null;

  const [step, setStep] = useState('loading'); // loading|greeting|pick|detail|method|info|cash|card|done
  const [greetPhase, setGreetPhase] = useState(0);
  const [product, setProduct] = useState(preselected || null);
  const [cart, setCart] = useState([]); // [{optionId, qty}]
  const [method, setMethod] = useState(null); // 'cash'|'card'

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zonecode, setZonecode] = useState('');
  const [baseAddr, setBaseAddr] = useState('');
  const [detailAddr, setDetailAddr] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [carouselTarget, setCarouselTarget] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  };

  useEffect(() => {
    const t = setTimeout(() => setStep('greeting'), 1700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (step !== 'greeting') return;
    const next = single && product ? 'detail' : 'pick';
    const timers = [
      setTimeout(() => setGreetPhase(1), 1200),
      setTimeout(() => setGreetPhase(2), 2600),
      setTimeout(() => setStep(next), 5400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step, single, product]);

  const openPostcode = () => {
    if (typeof window === 'undefined' || !window.daum?.Postcode) {
      showToast('주소 검색을 불러오는 중이에요.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: (d) => {
        setZonecode(d.zonecode);
        setBaseAddr(d.roadAddress || d.jibunAddress);
      },
    }).open();
  };

  const options = product?.options?.length ? product.options : product ? [DEFAULT_OPTION] : [];
  const hasRealOptions = Boolean(product?.options?.length);

  // 캐러셀 이미지: 옵션 사진이 있으면 옵션 사진만(대표 생략), 없으면 대표 사진
  const detailImages = useMemo(() => {
    if (!product) return [];
    const optImgs = (product.options || [])
      .filter((o) => o.imageUrl)
      .map((o) => ({ src: o.imageUrl, optionId: o.id }));
    if (optImgs.length > 0) return optImgs;
    return product.imageUrl ? [{ src: product.imageUrl, optionId: null }] : [];
  }, [product]);

  const scrollToOption = (optionId) => {
    const i = detailImages.findIndex((im) => im.optionId === optionId);
    if (i >= 0) setCarouselTarget(i);
  };

  const cartLines = useMemo(
    () =>
      cart.map((c) => ({
        ...c,
        option: options.find((o) => o.id === c.optionId) || DEFAULT_OPTION,
      })),
    [cart, options]
  );

  const cashCalc = product ? computeTotal(product, cart, 'cash') : { subtotal: 0, shipping: 0, total: 0 };
  const cardCalc = product ? computeTotal(product, cart, 'card') : { subtotal: 0, shipping: 0, total: 0 };
  const calc = method === 'card' ? cardCalc : cashCalc;

  const fullAddress = [baseAddr, detailAddr].filter(Boolean).join(' ');
  const canSubmitInfo = name.trim() && phone.trim() && baseAddr.trim();
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const selectProduct = (p) => {
    setProduct(p);
    setCart(p.options?.length ? [] : [{ optionId: 'default', qty: 1 }]);
    setStep('detail');
  };

  const addLine = (optionId) => {
    setCart((prev) => {
      const i = prev.findIndex((c) => c.optionId === optionId);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { optionId, qty: 1 }];
    });
  };
  const setQty = (optionId, delta) =>
    setCart((prev) =>
      prev
        .map((c) => (c.optionId === optionId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  const removeLine = (optionId) => setCart((prev) => prev.filter((c) => c.optionId !== optionId));

  const orderItems = () =>
    cartLines.map((l) => ({ optionId: l.optionId, label: l.option.label, qty: l.qty }));

  // ── 현금 주문 접수 ──
  const submitCashOrder = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          method: 'cash',
          items: orderItems(),
          name: name.trim(),
          phone: phone.trim(),
          address: fullAddress,
        }),
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      /* 실패해도 안내로 — 사장님이 입금 확인 */
    }
    setSubmitting(false);
    setStep('done');
  };

  const brand = product?.brand || BRAND;

  return (
    <>
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      {/* LOADING */}
      {step === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="pay-float mb-7" style={{ color: GOLD }}>
            <EclaMark size={52} />
          </div>
          <div className="font-[family-name:var(--font-jakarta)] text-[12px] tracking-[0.42em] uppercase text-[#9A9A95] mb-6">
            ÉCLARINE
          </div>
          <div className="pay-bar relative w-40 h-[3px] rounded-full bg-black/[0.06] overflow-hidden">
            <span />
          </div>
        </div>
      )}

      {/* GREETING */}
      {step === 'greeting' && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="pay-fade flex flex-col items-center">
            <div className="pay-float mb-5" style={{ color: GOLD }}>
              <EclaMark size={40} />
            </div>
            <div className="font-[family-name:var(--font-jakarta)] text-[12px] tracking-[0.42em] uppercase text-[#9A9A95] mb-3">
              ÉCLARINE
            </div>
            <div className="pay-sheen text-[26px] font-extrabold tracking-[-0.01em] mb-1">당신을 더 빛나게</div>
            <div className="text-[15px] font-bold tracking-[0.05em] text-[#1A1A1A]">{BRAND}</div>
          </div>
          {greetPhase >= 1 && (
            <p className="pay-fade mt-10 text-[17px] font-semibold text-[#1A1A1A]">
              안녕하세요, {BRAND}입니다 <span style={{ color: GOLD }}>:)</span>
            </p>
          )}
          {greetPhase >= 2 && (
            <p className="pay-fade mt-2 text-[15px] text-[#8A8A8A]">오늘 더 빛날 당신을 위해 — 천천히 둘러보세요 :)</p>
          )}
        </div>
      )}

      {/* PICK — 활성 상품 목록 */}
      {step === 'pick' && (
        <div className="pay-fade flex-1 px-6 py-10">
          <p className="text-[14px] text-[#8A8A8A] mb-1">{BRAND}</p>
          <h1 className="text-[21px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-6">
            구매하실 상품을 골라주세요
          </h1>
          {products.length === 0 ? (
            <p className="text-[14px] text-[#9A9A95] mt-10 text-center">준비 중인 상품이 곧 올라와요 :)</p>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProduct(p)}
                  className="text-left rounded-2xl border border-black/[0.07] bg-[#FAF8F3] overflow-hidden active:scale-[0.98] transition-transform"
                >
                  <div className="relative aspect-square bg-[#FAF8F3] overflow-hidden">
                    {coverOf(p) ? (
                      <FadeImage src={coverOf(p)} alt={p.name} sizes="50vw" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[#C9C9C2]">
                        <Gem size={30} strokeWidth={1.2} />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-[13.5px] font-bold text-[#1A1A1A] leading-snug break-keep line-clamp-2">
                      {p.name}
                    </div>
                    <PriceTag
                      listPrice={p.listPrice}
                      price={p.price}
                      from={p.options?.some((o) => o.cashAdd)}
                      size="sm"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DETAIL — 사진(드래그) + 하단 구매하기 → 바텀시트 */}
      {step === 'detail' && product && (
        <div className="pay-fade flex-1 flex flex-col">
          <div className="px-6 py-8 pb-32">
            {!single && (
              <button
                onClick={() => setStep('pick')}
                className="inline-flex items-center gap-1 text-[13px] text-[#8A8A8A] mb-3"
              >
                <ChevronLeft size={16} /> 상품 목록
              </button>
            )}
            {detailImages.length > 0 ? (
              <Carousel
                images={detailImages}
                target={carouselTarget}
                alt={product.name}
                className="mb-4"
                onTap={() => {
                  if (!hasRealOptions && cart.length === 0) addLine('default');
                  setSheetOpen(true);
                }}
              />
            ) : (
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#FAF8F3] mb-4 grid place-items-center text-[#C9C9C2]">
                <Gem size={40} strokeWidth={1.2} />
              </div>
            )}
            <div
              className="font-[family-name:var(--font-jakarta)] text-[10px] tracking-[0.2em] uppercase mb-1.5"
              style={{ color: GOLD }}
            >
              {brand}
            </div>
            <h1 className="text-[19px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-1.5 break-keep">
              {product.name}
            </h1>
            <PriceTag
              listPrice={product.listPrice}
              price={product.price}
              from={product.options?.some((o) => o.cashAdd)}
              size="lg"
            />

            {hasRealOptions && (
              <div className="mt-6">
                <div className="text-[12px] font-bold text-[#8A8A8A] mb-2.5">색상 · 옵션</div>
                <div className="flex gap-2.5 flex-wrap">
                  {options.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        scrollToOption(o.id);
                        addLine(o.id);
                        setSheetOpen(true);
                      }}
                      className="flex items-center gap-2 rounded-full border border-black/[0.12] bg-white pl-1.5 pr-3.5 py-1.5 active:scale-[0.97] transition-transform"
                    >
                      {o.imageUrl ? (
                        <span className="relative w-7 h-7 rounded-full overflow-hidden bg-[#FAF8F3]">
                          <FadeImage src={o.imageUrl} alt={o.label} sizes="28px" />
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-full bg-[#F1ECE0]" />
                      )}
                      <span className="text-[13px] font-semibold text-[#1A1A1A]">{o.label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[12px] text-[#B5B5AE]">사진은 좌우로 넘겨 보세요. 옵션을 누르면 바로 담겨요.</p>
              </div>
            )}
          </div>

          {/* 하단 고정 구매하기 */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 bg-white/95 backdrop-blur border-t border-black/[0.06] z-30">
            <button
              onClick={() => {
                if (!hasRealOptions && cart.length === 0) addLine('default');
                setSheetOpen(true);
              }}
              className="w-full text-[16px] font-bold rounded-2xl py-4 text-white active:scale-[0.98] transition-transform"
              style={{ background: '#1A1A1A' }}
            >
              {cartCount > 0 ? `${cartCount}개 담김 · 구매하기` : '구매하기'}
            </button>
          </div>

          {sheetOpen && (
            <PurchaseSheet
              product={product}
              options={options}
              hasRealOptions={hasRealOptions}
              cartLines={cartLines}
              cartCount={cartCount}
              subtotal={cashCalc.subtotal}
              onPick={(id) => {
                addLine(id);
                scrollToOption(id);
              }}
              onQty={setQty}
              onRemove={removeLine}
              onClose={() => setSheetOpen(false)}
              onProceed={() => {
                setSheetOpen(false);
                setStep('method');
              }}
            />
          )}
        </div>
      )}

      {/* METHOD — 현금/카드 */}
      {step === 'method' && product && (
        <div className="pay-fade flex-1 flex flex-col px-6 py-8">
          <button
            onClick={() => setStep('detail')}
            className="inline-flex items-center gap-1 text-[13px] text-[#8A8A8A] mb-3"
          >
            <ChevronLeft size={16} /> 상품으로
          </button>
          <h1 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-1">결제수단을 골라주세요</h1>
          <p className="text-[13.5px] text-[#9A9A95] mb-6">선택하신 방법으로 안내해드릴게요.</p>

          <MethodCard
            title="현금이체"
            desc="계좌로 입금하시면 확인 후 발송해요."
            subtotal={cashCalc.subtotal}
            total={cashCalc.total}
            shipping={cashCalc.shipping}
            selected={method === 'cash'}
            onClick={() => setMethod('cash')}
          />
          <div className="h-3" />
          <MethodCard
            title="카드결제"
            desc="토스로 안전하게 카드·간편결제."
            subtotal={cardCalc.subtotal}
            total={cardCalc.total}
            shipping={cardCalc.shipping}
            islandNote
            selected={method === 'card'}
            onClick={() => setMethod('card')}
          />

          <div className="mt-auto pt-6">
            <button
              onClick={() => setStep('info')}
              disabled={!method}
              className="w-full text-[16px] font-bold rounded-2xl py-4 transition-transform active:scale-[0.98] disabled:opacity-40 text-white"
              style={{ background: method ? '#1A1A1A' : '#C9C9C2' }}
            >
              {method === 'card' ? '카드결제로 진행' : method === 'cash' ? '현금이체로 진행' : '결제수단을 선택하세요'}
            </button>
          </div>
        </div>
      )}

      {/* INFO — 배송 정보 */}
      {step === 'info' && product && (
        <div className="pay-fade flex-1 flex flex-col px-6 py-8">
          <button
            onClick={() => setStep('method')}
            className="inline-flex items-center gap-1 text-[13px] text-[#8A8A8A] mb-3"
          >
            <ChevronLeft size={16} /> 결제수단
          </button>
          <h1 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-1">배송 정보를 알려주세요</h1>
          <p className="text-[13.5px] text-[#9A9A95] mb-6">받으실 분의 정보를 입력해 주세요.</p>

          <div className="flex flex-col gap-4">
            <Field label="이름">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="받으실 분 성함"
                className="pay-input"
              />
            </Field>
            <Field label="연락처">
              <input
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                inputMode="numeric"
                placeholder="010-0000-0000"
                className="pay-input"
              />
            </Field>
            <Field label="주소">
              <div className="flex gap-2">
                <input
                  value={zonecode}
                  readOnly
                  placeholder="우편번호"
                  onClick={openPostcode}
                  className="pay-input w-28 cursor-pointer"
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
                value={baseAddr}
                readOnly
                placeholder="검색 버튼을 눌러 주소를 선택하세요"
                onClick={openPostcode}
                className="pay-input mt-2 cursor-pointer"
              />
              <input
                value={detailAddr}
                onChange={(e) => setDetailAddr(e.target.value)}
                placeholder="상세주소 (동·호수 등)"
                className="pay-input mt-2"
              />
            </Field>
          </div>

          <OrderSummary product={product} lines={cartLines} method={method} calc={calc} hasRealOptions={hasRealOptions} />

          <div className="mt-6">
            <button
              onClick={() => setStep(method === 'card' ? 'card' : 'cash')}
              disabled={!canSubmitInfo}
              className="w-full text-[16px] font-bold rounded-2xl py-4 transition-transform active:scale-[0.98] disabled:opacity-40 text-white"
              style={{ background: canSubmitInfo ? '#1A1A1A' : '#C9C9C2' }}
            >
              {method === 'card' ? '카드 결제하기' : '입금 계좌 확인하기'}
            </button>
            {!canSubmitInfo && (
              <p className="mt-2 text-[12.5px] text-center text-[#B5B5AE]">이름 · 연락처 · 주소를 입력해 주세요.</p>
            )}
          </div>
        </div>
      )}

      {/* CASH — 계좌 안내 + 송금확인 */}
      {step === 'cash' && product && (
        <div className="pay-fade flex-1 flex flex-col px-6 py-8">
          <button
            onClick={() => setStep('info')}
            className="inline-flex items-center gap-1 text-[13px] text-[#8A8A8A] mb-3"
          >
            <ChevronLeft size={16} /> 정보 수정
          </button>
          <h1 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-5">아래 계좌로 입금해 주세요</h1>

          <div className="rounded-2xl p-5 text-white" style={{ background: '#1A1A1A' }}>
            <div className="font-[family-name:var(--font-jakarta)] text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>
              Bank Transfer
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-[13px] text-white/60 mb-1">
                  {account.bank} · {account.holder}
                </div>
                <div className="text-[20px] font-extrabold tracking-[0.01em]">{account.number}</div>
              </div>
              <button
                onClick={() => copyAccount()}
                className="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-bold rounded-full px-3.5 py-2"
                style={{ background: GOLD, color: '#1A1A1A' }}
              >
                <Copy size={14} /> 복사
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-1.5">
              <Row light label="상품 합계" value={formatKRW(cashCalc.subtotal)} />
              <Row light label="배송비" value={cashCalc.shipping > 0 ? formatKRW(cashCalc.shipping) : '무료'} />
              <div className="mt-1.5 pt-2.5 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-[13px] text-white/80 font-semibold">입금하실 금액</span>
                <span className="text-[19px] font-extrabold" style={{ color: GOLD }}>
                  {formatKRW(cashCalc.total)}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[13px] text-center text-[#9A9A95]">
            입금자명을 <b className="text-[#1A1A1A]">{name || '주문자'}</b> 으로 보내주세요 :)
          </p>

          <div className="mt-auto pt-6">
            <button
              onClick={submitCashOrder}
              className="w-full text-[16px] font-bold rounded-2xl py-4 text-white active:scale-[0.98] transition-transform"
              style={{ background: '#1A1A1A' }}
            >
              입금 완료 · 주문 접수하기
            </button>
          </div>
        </div>
      )}

      {/* CARD — Toss 위젯 */}
      {step === 'card' && product && (
        <TossCheckout
          product={product}
          items={orderItems()}
          amount={cardCalc.total}
          customer={{ name: name.trim(), phone: phone.trim(), address: fullAddress }}
          tossClientKey={tossClientKey}
          onBack={() => setStep('info')}
        />
      )}

      {/* DONE (현금) */}
      {step === 'done' && (
        <div className="pay-fade flex-1 grid place-items-center px-8 text-center">
          <div>
            <div className="mx-auto mb-6 grid place-items-center w-16 h-16 rounded-full" style={{ background: GOLD }}>
              <EclaMark size={34} className="text-white" />
            </div>
            <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-2">주문이 접수되었어요</h1>
            <p className="text-[14.5px] text-[#7A7A7A] leading-relaxed">
              입금 확인 후 정성껏 준비해 보내드릴게요.
              <br />
              {BRAND}을(를) 찾아주셔서 감사합니다 :)
            </p>
            <div className="mt-8 font-[family-name:var(--font-jakarta)] text-[12px] tracking-[0.3em] uppercase text-[#B5B5AE]">
              ÉCLARINE
            </div>
          </div>
        </div>
      )}

      {submitting && <LoadingOverlay label="주문 접수 중…" />}
      {toast && (
        <div className="pay-fade fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-[#1A1A1A] text-white text-[13.5px] font-semibold px-5 py-3 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </>
  );

  function copyAccount() {
    copyText(account.number).then(() => showToast('복사가 완료되었어요.'));
  }
}

function PurchaseSheet({ product, options, hasRealOptions, cartLines, cartCount, subtotal, onPick, onQty, onRemove, onClose, onProceed }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="pay-fade absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="sheet-up relative bg-white rounded-t-3xl px-6 pt-3 pb-7 max-h-[82vh] overflow-y-auto">
        <div className="sticky top-0 bg-white pt-1 pb-3 z-10">
          <div className="mx-auto w-10 h-1 rounded-full bg-black/15" />
          <button onClick={onClose} className="absolute right-0 top-1 text-[#B5B5AE] p-1">
            <X size={20} />
          </button>
          <h2 className="text-[16px] font-extrabold text-[#1A1A1A] mt-2">{product.name}</h2>
        </div>

        {hasRealOptions && (
          <div className="mb-4">
            <label className="block text-[12.5px] font-bold text-[#8A8A8A] mb-2">옵션 선택</label>
            <select value="" onChange={(e) => e.target.value && onPick(e.target.value)} className="pay-input">
              <option value="">옵션을 선택하세요</option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label} — {formatKRW(unitPrice(product, o, 'cash'))}
                </option>
              ))}
            </select>
          </div>
        )}

        {cartLines.length > 0 ? (
          <div className="flex flex-col gap-2 mb-4">
            {cartLines.map((l) => (
              <div
                key={l.optionId}
                className="flex items-center gap-3 rounded-xl bg-[#FAF8F3] border border-black/[0.06] px-3.5 py-2.5"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-[#1A1A1A] break-keep">
                    {hasRealOptions ? l.option.label : product.name}
                  </div>
                  <div className="text-[12px] text-[#8A8A8A]">{formatKRW(unitPrice(product, l.option, 'cash'))}</div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => onQty(l.optionId, -1)}
                    className="w-7 h-7 rounded-md border border-black/15 grid place-items-center"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-5 text-center text-[14px] font-bold">{l.qty}</span>
                  <button
                    onClick={() => onQty(l.optionId, 1)}
                    className="w-7 h-7 rounded-md border border-black/15 grid place-items-center"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                {hasRealOptions && (
                  <button onClick={() => onRemove(l.optionId)} className="text-[#C9C9C2] hover:text-[#E85D3A] shrink-0">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#9A9A95] py-6 text-center">위에서 옵션을 선택해 담아주세요.</p>
        )}

        <div className="flex items-baseline justify-between border-t border-black/[0.08] pt-3.5 mb-4">
          <span className="text-[13px] font-bold text-[#8A8A8A]">상품 합계</span>
          <span className="text-[19px] font-extrabold" style={{ color: GOLD }}>
            {formatKRW(subtotal)}
          </span>
        </div>

        <button
          onClick={onProceed}
          disabled={cartCount === 0}
          className="w-full text-[16px] font-bold rounded-2xl py-4 text-white active:scale-[0.98] transition-transform disabled:opacity-40"
          style={{ background: cartCount > 0 ? '#1A1A1A' : '#C9C9C2' }}
        >
          {cartCount > 0 ? `${cartCount}개 · 결제수단 선택` : '상품을 담아주세요'}
        </button>
      </div>
    </div>
  );
}

function Carousel({ images, target = 0, alt, className = '', onTap }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const down = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * target, behavior: 'smooth' });
  }, [target]);

  const onScroll = (e) => {
    const el = e.currentTarget;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIdx((prev) => (prev === i ? prev : i));
  };

  // 탭(이동<10px)이면 시트 열기, 드래그면 사진 넘기기
  const onPointerDown = (e) => {
    down.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    if (!down.current || !onTap) return;
    const dx = Math.abs(e.clientX - down.current.x);
    const dy = Math.abs(e.clientY - down.current.y);
    down.current = null;
    if (dx < 10 && dy < 10) onTap();
  };

  return (
    <div className={className}>
      <div
        ref={ref}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-3xl cursor-pointer"
      >
        {images.map((im, i) => (
          <div
            key={i}
            className="relative shrink-0 w-full aspect-square snap-center bg-[#FAF8F3] overflow-hidden"
          >
            <FadeImage src={im.src} alt={alt} priority={i === 0} sizes="100vw" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === idx ? 20 : 6, background: i === idx ? GOLD : '#D8D4CA' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PriceTag({ listPrice, price, from = false, size = 'sm' }) {
  const pct = salePercent(listPrice, price);
  const big = size === 'lg';
  const fromTxt = from ? (
    <span className={`font-medium text-[#9A9A95] ${big ? 'text-[13px]' : 'text-[11px]'}`}>부터</span>
  ) : null;
  if (!pct) {
    return (
      <div className={`font-extrabold text-[#1A1A1A] ${big ? 'text-[22px]' : 'mt-1 text-[14px]'}`}>
        {formatKRW(price)} {fromTxt}
      </div>
    );
  }
  return (
    <div className={big ? '' : 'mt-1'}>
      <div className="flex items-center gap-1.5">
        <span className={`font-extrabold ${big ? 'text-[15px]' : 'text-[12px]'}`} style={{ color: '#E85D3A' }}>
          {pct}%
        </span>
        <span className={`text-[#B5B5AE] line-through ${big ? 'text-[14px]' : 'text-[11px]'}`}>
          {formatKRW(listPrice)}
        </span>
      </div>
      <div className={`font-extrabold text-[#1A1A1A] ${big ? 'text-[22px]' : 'text-[14px]'}`}>
        {formatKRW(price)} {fromTxt}
      </div>
    </div>
  );
}

function MethodCard({ title, desc, subtotal, total, shipping, selected, onClick, islandNote }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        selected ? 'border-[#B8A06A] bg-[#FAF8F3]' : 'border-black/[0.1] bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-extrabold text-[#1A1A1A]">{title}</span>
        {shipping > 0 ? (
          <span className="text-[11px] font-bold text-[#8A8A8A] bg-black/[0.05] rounded-full px-2.5 py-1">
            배송비 {formatKRW(shipping)}
          </span>
        ) : (
          <span className="text-[11px] font-bold text-white rounded-full px-2.5 py-1" style={{ background: GOLD }}>
            무료배송
          </span>
        )}
      </div>
      <p className="mt-1 text-[12.5px] text-[#9A9A95]">{desc}</p>
      {islandNote && shipping > 0 && (
        <p className="mt-0.5 text-[11.5px] text-[#B5B5AE]">제주·도서산간 추가 배송비가 있을 수 있어요.</p>
      )}
      <div className="mt-3 border-t border-black/[0.06] pt-3 flex flex-col gap-1">
        <div className="flex items-baseline justify-between text-[12.5px] text-[#8A8A8A]">
          <span>상품 금액</span>
          <span>{formatKRW(subtotal)}</span>
        </div>
        <div className="flex items-baseline justify-between text-[12.5px] text-[#8A8A8A]">
          <span>배송비</span>
          <span>{shipping > 0 ? formatKRW(shipping) : '무료'}</span>
        </div>
        <div className="mt-1 pt-2 border-t border-black/[0.06] flex items-baseline justify-between">
          <span className="text-[13px] font-bold text-[#1A1A1A]">결제 금액</span>
          <span className="text-[18px] font-extrabold" style={{ color: selected ? GOLD : '#1A1A1A' }}>
            {formatKRW(total)}
          </span>
        </div>
      </div>
    </button>
  );
}

function OrderSummary({ product, lines, method, calc, hasRealOptions }) {
  return (
    <div className="mt-7 rounded-2xl bg-[#FAF8F3] border border-[#B8A06A]/20 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-[#FAF8F3]">
          {product.imageUrl && <FadeImage src={product.imageUrl} alt={product.name} sizes="48px" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-bold text-[#1A1A1A] truncate">{product.name}</div>
          <div className="text-[12px] text-[#9A9A95]">{method === 'card' ? '카드결제' : '현금이체'}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-[12.5px] text-[#6B6B6B]">
        {lines.map((l) => (
          <div key={l.optionId} className="flex justify-between">
            <span>
              {(hasRealOptions ? l.option.label : product.name)} × {l.qty}
            </span>
            <span>{formatKRW(unitPrice(product, l.option, method) * l.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between">
          <span>배송비</span>
          <span>{calc.shipping > 0 ? formatKRW(calc.shipping) : '무료'}</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-black/[0.08] flex items-baseline justify-between">
        <span className="text-[13px] font-bold text-[#1A1A1A]">합계</span>
        <span className="text-[17px] font-extrabold" style={{ color: GOLD }}>
          {formatKRW(calc.total)}
        </span>
      </div>
    </div>
  );
}

function TossCheckout({ product, items, amount, customer, tossClientKey, onBack }) {
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState('');
  const widgetsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { loadTossPayments, ANONYMOUS } = await import('@tosspayments/tosspayments-sdk');
        const toss = await loadTossPayments(tossClientKey);
        if (cancelled) return;
        const widgets = toss.widgets({ customerKey: ANONYMOUS });
        widgetsRef.current = widgets;
        await widgets.setAmount({ currency: 'KRW', value: amount });
        await Promise.all([
          widgets.renderPaymentMethods({ selector: '#toss-payment-method', variantKey: 'DEFAULT' }),
          widgets.renderAgreement({ selector: '#toss-agreement', variantKey: 'AGREEMENT' }),
        ]);
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setErr('결제 모듈을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [amount, tossClientKey]);

  const pay = async () => {
    if (!widgetsRef.current) return;
    setPaying(true);
    setErr('');
    try {
      // 결제 전 주문을 pending 으로 저장 → orderId 발급
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, method: 'card', items, ...customer }),
      });
      const { orderId, error } = await res.json();
      if (!res.ok || !orderId) throw new Error(error || 'order');

      await widgetsRef.current.requestPayment({
        orderId,
        orderName: product.name + (items.length > 1 ? ` 외 ${items.length - 1}건` : ''),
        successUrl: `${window.location.origin}/pay/card/success`,
        failUrl: `${window.location.origin}/pay/card/fail`,
        customerName: customer.name,
        customerMobilePhone: customer.phone.replace(/[^0-9]/g, ''),
      });
    } catch (e) {
      setPaying(false);
      if (e?.code === 'USER_CANCEL') return;
      setErr('결제를 시작하지 못했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="pay-fade flex-1 flex flex-col px-6 py-8">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-[13px] text-[#8A8A8A] mb-3">
        <ChevronLeft size={16} /> 정보 수정
      </button>
      <h1 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-1">카드로 결제하기</h1>
      <p className="text-[13.5px] text-[#9A9A95] mb-5">
        결제 금액 <b className="text-[#1A1A1A]">{formatKRW(amount)}</b>
      </p>

      <div id="toss-payment-method" />
      <div id="toss-agreement" className="mt-2" />
      {err && <p className="mt-3 text-[13px] text-[#E85D3A] font-medium">{err}</p>}

      <div className="mt-6">
        <button
          onClick={pay}
          disabled={!ready || paying}
          className="w-full text-[16px] font-bold rounded-2xl py-4 text-white active:scale-[0.98] transition-transform disabled:opacity-50"
          style={{ background: '#1A1A1A' }}
        >
          {paying ? '결제창 여는 중…' : !ready ? '불러오는 중…' : `${formatKRW(amount)} 결제하기`}
        </button>
      </div>
      {paying && <LoadingOverlay label="결제 진행 중…" />}
    </div>
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

function Row({ label, value, light }) {
  return (
    <div className={`flex items-baseline justify-between text-[13px] ${light ? 'text-white/60' : 'text-[#6B6B6B]'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
