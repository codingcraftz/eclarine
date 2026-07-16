import { after } from 'next/server';

import { confirmPayment, notifyPaid } from '@/lib/toss';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const result = await confirmPayment({
    paymentKey: String(body.paymentKey || ''),
    orderId: String(body.orderId || ''),
    amount: Math.round(Number(body.amount) || 0),
  });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  // 방금 결제 확정된 건만 알림 (already면 중복 알림 방지)
  if (!result.already) after(() => notifyPaid(result.order));

  return Response.json({ ok: true, already: result.already ?? false });
}
