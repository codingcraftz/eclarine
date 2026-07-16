import { after } from 'next/server';

import { createOrder } from '@/lib/orders';
import { notifyOrder } from '@/lib/notify';

export const runtime = 'nodejs';

const clip = (v) => String(v ?? '').trim().slice(0, 500);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const id = clip(body.id);
  const method = body.method === 'card' ? 'card' : 'cash';
  const name = clip(body.name);
  const phone = clip(body.phone);
  const address = clip(body.address);
  const items = Array.isArray(body.items)
    ? body.items
        .map((it) => ({
          optionId: String(it.optionId || 'default'),
          label: clip(it.label),
          qty: Math.max(1, Math.round(Number(it.qty) || 0)),
        }))
        .filter((it) => it.qty > 0)
        .slice(0, 50)
    : [];

  if (!id || !name || !phone || !address) {
    return Response.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 });
  }
  if (items.length === 0) {
    return Response.json({ error: '상품을 선택해주세요.' }, { status: 400 });
  }

  const result = await createOrder({ id, method, name, phone, address, items });
  if (!result) {
    return Response.json({ error: '판매 중인 상품이 아닙니다.' }, { status: 404 });
  }

  const { order, subtotal, shipping } = result;

  // 카드결제: confirm 시점에 알림. 여기선 pending만 저장하고 orderId 반환.
  if (method === 'card') {
    return Response.json({ ok: true, orderId: order.orderKey, amount: order.amount });
  }

  // 현금이체: 즉시 접수 알림 (응답 후 백그라운드)
  after(() => notifyOrder({ kind: 'cash', order, subtotal, shipping }));

  return Response.json({ ok: true, orderId: order.orderKey });
}
