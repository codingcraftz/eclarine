import { after } from 'next/server';

import { confirmPayment, notifyPaid } from '@/lib/toss';
import { orderByKey } from '@/lib/orders';

export const runtime = 'nodejs';

// 토스 결제 상태 webhook. 유저가 결제 후 successUrl 도달 전 탭을 닫으면
// 브라우저發 confirm이 안 온다 → 여기서 서버가 직접 confirm해 pending을 복구한다.
//
// 위조 방지: confirmPayment는 우리 secret으로 토스 API를 다시 호출하고
// 저장된 amount와 대조하므로, 가짜 webhook이 할 수 있는 최대치는
// "이미 존재하고 금액이 맞는 pending 주문을 확정"뿐 — 정상 결과와 같다.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const data = body?.data || body;
  const orderId = String(data?.orderId || '');
  const paymentKey = String(data?.paymentKey || '');
  const status = String(data?.status || body?.eventType || '');

  // 처리 대상: 승인 완료 계열만. 그 외(취소/실패)는 무시하고 200.
  const paidLike = /DONE|PAID|COMPLETED/i.test(status);
  if (!orderId || !paymentKey || !paidLike) {
    return Response.json({ ok: true, skipped: true });
  }

  const order = await orderByKey(orderId);
  if (!order) return Response.json({ ok: true, skipped: 'no-order' });
  if (order.status === 'paid') return Response.json({ ok: true, already: true });

  const result = await confirmPayment({ paymentKey, orderId, amount: order.amount });
  if (result.ok && !result.already) after(() => notifyPaid(result.order));

  // 토스에는 항상 200(재시도 폭주 방지). 내부 실패는 로그로.
  if (!result.ok) console.error('[webhook] confirm failed:', orderId, result.error);
  return Response.json({ ok: result.ok });
}
