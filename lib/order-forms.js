import 'server-only';

import { desc, eq } from 'drizzle-orm';

import { db, orderForms, orderFormImages } from '@/lib/db';

export const FORM_STATUSES = ['결제확인대기', '결제확인', '발송준비', '발송완료'];
export const IMAGE_STATUSES = ['준비전', '준비완료', '주문접수', '주문접수 완료'];

export async function createOrderForm(data, imageUrls) {
  const [row] = await db.insert(orderForms).values(data).returning();

  if (imageUrls.length > 0) {
    await db
      .insert(orderFormImages)
      .values(imageUrls.map((url) => ({ orderFormId: row.id, url })));
  }

  return row;
}

// 주문 + 사진을 한 번에. 주문 수가 적어 두 번 읽고 메모리에서 묶는다.
export async function listOrderForms() {
  const forms = await db.select().from(orderForms).orderBy(desc(orderForms.createdAt));
  if (forms.length === 0) return [];

  const images = await db
    .select()
    .from(orderFormImages)
    .orderBy(orderFormImages.createdAt);

  return forms.map((f) => ({ ...f, images: images.filter((im) => im.orderFormId === f.id) }));
}

export async function setFormStatus(id, status) {
  await db.update(orderForms).set({ status }).where(eq(orderForms.id, id));
}

export async function setImageStatus(id, imageStatus) {
  await db.update(orderFormImages).set({ imageStatus }).where(eq(orderFormImages.id, id));
}
