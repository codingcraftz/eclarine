import 'server-only';

import { desc, eq } from 'drizzle-orm';

import { db, orders } from '@/lib/db';
import { computeTotal } from '@/lib/pricing';
import { itemsSummary } from '@/lib/notify';
import { productById } from '@/lib/products';

const rand = () => Math.random().toString(36).slice(2, 7).toUpperCase();
const newOrderKey = () => `ECLA${Date.now()}${rand()}`;

// 클라이언트가 보낸 items를 신뢰하지 않고 서버에서 상품을 다시 읽어 총액을 재계산한다.
// 반환: { order, subtotal, shipping } — order.orderKey를 토스에 넘긴다.
export async function createOrder({ id, method, name, phone, address, items }) {
  const product = await productById(id);
  if (!product || product.active === false) return null;

  const { subtotal, shipping, total } = computeTotal(product, items, method);
  const summary = itemsSummary(product, items);
  const orderKey = newOrderKey();

  const [row] = await db
    .insert(orders)
    .values({
      orderKey,
      productId: id,
      productName: product.name,
      amount: total,
      name,
      phone,
      address,
      method,
      items,
      status: 'pending',
    })
    .returning();

  return { order: { ...row, summary }, subtotal, shipping };
}

export function listOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
}

export async function orderByKey(orderKey) {
  const [row] = await db.select().from(orders).where(eq(orders.orderKey, orderKey)).limit(1);
  return row || null;
}

export async function markPaid(orderKey, paymentKey) {
  await db
    .update(orders)
    .set({ status: 'paid', paymentKey })
    .where(eq(orders.orderKey, orderKey));
}
