import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// options: [{ id, label, cashAdd, cardAdd, imageUrl }] — cashAdd/cardAdd는 음수 허용(묶음 할인)
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  brand: text('brand'),
  price: integer('price').notNull(),
  listPrice: integer('list_price'),
  cardPrice: integer('card_price'),
  shippingFee: integer('shipping_fee').notNull().default(0),
  cardShippingFee: integer('card_shipping_fee').notNull().default(0),
  options: jsonb('options').notNull().default([]),
  imageUrl: text('image_url'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// /shop · /pay 결제 주문. orderKey는 토스에 넘기는 ECLA… 문자열
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderKey: text('order_key').notNull().unique(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull(),
  amount: integer('amount').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  method: text('method').notNull(), // 'cash' | 'card'
  items: jsonb('items').notNull().default([]), // [{ optionId, label, qty }]
  status: text('status').notNull().default('pending'), // 'pending' | 'paid'
  paymentKey: text('payment_key'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// /form 라이브 주문서. amount는 방송 중 고지된 금액을 고객이 직접 입력한다
export const orderForms = pgTable('order_forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  nickname: text('nickname').notNull(), // 유튜브 닉네임
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  addressDetail: text('address_detail'),
  payment: text('payment').notNull(), // '계좌이체' | '카드결제'
  amount: integer('amount').notNull(),
  request: text('request'),
  status: text('status').notNull().default('결제확인대기'), // 결제확인대기|결제확인|발송준비|발송완료
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 고객이 올린 방송 캡쳐사진. imageStatus는 내부 처리 상태(사진 단위 발주 추적)
export const orderFormImages = pgTable('order_form_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderFormId: uuid('order_form_id')
    .notNull()
    .references(() => orderForms.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  imageStatus: text('image_status').notNull().default('준비전'), // 준비전|준비완료|주문접수|주문접수 완료
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
