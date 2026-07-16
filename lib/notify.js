import 'server-only';

const won = (n) => `${Number(n || 0).toLocaleString('ko-KR')}원`;

// 주문 구성 요약: "은 체인 팔찌 × 2, 진주 귀걸이 × 1"
export function itemsSummary(product, items) {
  const opts = product?.options || [];
  return (items || [])
    .map((it) => {
      const opt = opts.find((o) => o.id === it.optionId);
      const label = opt?.label || it.label || product?.name || '상품';
      return `${label} × ${it.qty}`;
    })
    .join(', ');
}

// 주문 알림 → Discord. best-effort: 실패해도 결제 흐름을 막지 않는다.
export async function notifyOrder({ kind, order, subtotal, shipping }) {
  const webhook = process.env.ORDER_DISCORD_WEBHOOK_URL;
  if (!webhook) return;

  const cash = kind === 'cash';
  const amountField = cash
    ? `${won(order.amount)}${
        shipping > 0
          ? ` (상품 ${won(subtotal)} + 배송 ${won(shipping)})`
          : ' (무료배송)'
      }`
    : won(order.amount);

  const body = {
    embeds: [
      {
        title: `${cash ? '🛒 새 주문(현금)' : '💳 새 주문(카드결제 완료)'} — ${order.productName}`,
        color: cash ? 1596123 : 3066993,
        fields: [
          { name: '주문자', value: order.name, inline: true },
          { name: '연락처', value: order.phone, inline: true },
          { name: '결제금액', value: amountField, inline: true },
          { name: '구성', value: order.summary || '-' },
          { name: '주소', value: order.address },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    /* 알림 실패는 삼킨다 */
  }
}
