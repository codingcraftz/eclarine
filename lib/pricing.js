// 가격 계산 — 클라이언트·서버 공용. 위변조 방지를 위해 서버에서 항상 재계산한다.

export const BRAND = '에끌라린';

export const ACCOUNT = {
  bank: 'KB국민',
  number: '616337-04-006481',
  holder: '박준영(구름섬컴퍼니)',
};

export const KAKAO_CHANNEL = 'http://pf.kakao.com/_qxcWrn';

export const formatKRW = (n) => `₩${Number(n || 0).toLocaleString('ko-KR')}`;

// 원가(list_price)가 판매가보다 크면 세일 — 할인율(%) 반환, 아니면 0
export function salePercent(listPrice, price) {
  if (!listPrice || listPrice <= price) return 0;
  return Math.round((1 - price / listPrice) * 100);
}

// 카드 기본가 미설정 시 현금가로 폴백
export function basePrice(product, method) {
  return method === 'card' ? (product.cardPrice ?? product.price) : product.price;
}

export function optionAdd(option, method) {
  if (!option) return 0;
  return method === 'card' ? option.cardAdd || 0 : option.cashAdd || 0;
}

export function unitPrice(product, option, method) {
  return basePrice(product, method) + optionAdd(option, method);
}

export function shippingFee(product, method) {
  return method === 'card' ? product.cardShippingFee || 0 : product.shippingFee || 0;
}

// items: [{ optionId, qty }]
export function computeTotal(product, items, method) {
  const opts = product.options || [];
  const subtotal = (items || []).reduce((sum, it) => {
    const opt = opts.find((o) => o.id === it.optionId) || null;
    return sum + unitPrice(product, opt, method) * (Number(it.qty) || 0);
  }, 0);
  const shipping = shippingFee(product, method);
  return { subtotal, shipping, total: subtotal + shipping };
}
