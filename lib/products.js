import 'server-only';

import { desc, eq } from 'drizzle-orm';

import { db, products } from '@/lib/db';

export function activeProducts() {
  return db.select().from(products).where(eq(products.active, true)).orderBy(desc(products.createdAt));
}

export function allProducts() {
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function productById(id) {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row || null;
}

export async function createProduct(fields) {
  const [row] = await db.insert(products).values(fields).returning();
  return row;
}

export async function updateProduct(id, fields) {
  const [row] = await db.update(products).set(fields).where(eq(products.id, id)).returning();
  return row || null;
}

export async function deleteProduct(id) {
  const [row] = await db.delete(products).where(eq(products.id, id)).returning();
  return row || null;
}
