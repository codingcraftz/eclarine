import 'server-only';

import { markPaid, orderByKey } from '@/lib/orders';
import { itemsSummary, notifyOrder } from '@/lib/notify';

// 토스 결제 승인 + DB 확정. confirm 라우트와 webhook 라우트가 공유한다.
// 알림은 호출부에서 after()로 응답 뒤에 돌린다(응답 지연 방지).
// 반환: { ok, status, order?, already?, error? }
export async function confirmPayment({ paymentKey, orderId, amount }) {
  if (!paymentKey || !orderId || !amount) {
    return { ok: false, status: 400, error: '결제 정보가 올바르지 않습니다.' };
  }

  const order = await orderByKey(orderId);
  if (!order) return { ok: false, status: 404, error: '주문을 찾을 수 없습니다.' };
  if (order.status === 'paid') return { ok: true, status: 200, already: true, order };
  if (order.amount !== amount) {
    return { ok: false, status: 400, error: '결제 금액이 일치하지 않습니다.' };
  }

  const secret = process.env.TOSS_SECRET_KEY;
  if (!secret) return { ok: false, status: 500, error: '결제 설정 오류입니다.' };

  const auth = Buffer.from(`${secret}:`).toString('base64');
  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { ok: false, status: 400, error: data?.message || '결제 승인에 실패했습니다.' };
  }

  await markPaid(orderId, paymentKey);
  return { ok: true, status: 200, order };
}

export function notifyPaid(order) {
  const summary = itemsSummary({ options: [] }, order.items);
  return notifyOrder({ kind: 'card', order: { ...order, summary } });
}
