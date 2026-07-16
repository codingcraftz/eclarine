// 상품 시드: public/products/*.jpeg 를 MinIO에 올리고 products 행 생성.
// 실행: node --env-file=.env.local scripts/seed.mjs  (SSH 터널 필요: 5442, 9200)
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_SECRET_KEY },
});

async function upload(localPath, key) {
  await s3.send(
    new PutObjectCommand({
      Bucket: 'product-images',
      Key: key,
      Body: await readFile(localPath),
      ContentType: 'image/jpeg',
    })
  );
  return `${process.env.S3_PUBLIC_URL}/product-images/${key}`;
}

// accessory-data.js의 실제 상품 중 2종 (라이브 판매 테스트용)
const SEED = [
  {
    name: '올실버 진주토끼 귀걸이',
    brand: 'ECLARINE',
    price: 32000,
    listPrice: 39000,
    cardPrice: 33000,
    shippingFee: 3000,
    cardShippingFee: 3000,
    photo: 'products/1.jpeg',
    localPhoto: 'public/products/1.jpeg',
    options: [],
  },
  {
    name: '블링블링 실버 체인 팔찌',
    brand: 'ECLARINE',
    price: 96000,
    listPrice: null,
    cardPrice: 99000,
    shippingFee: 0,
    cardShippingFee: 0,
    photo: 'products/3.jpeg',
    localPhoto: 'public/products/3.jpeg',
    options: [],
  },
];

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

for (const p of SEED) {
  const imageUrl = await upload(p.localPhoto, p.photo);
  const { rows } = await pool.query(
    `insert into products (name, brand, price, list_price, card_price, shipping_fee, card_shipping_fee, options, image_url, active)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,true) returning id`,
    [p.name, p.brand, p.price, p.listPrice, p.cardPrice, p.shippingFee, p.cardShippingFee, JSON.stringify(p.options), imageUrl]
  );
  console.log(`seeded: ${p.name} → ${rows[0].id}`);
}

await pool.end();
console.log('done');
