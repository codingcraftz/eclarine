import 'server-only';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const PRODUCT_BUCKET = 'product-images';
export const CAPTURE_BUCKET = 'order-captures';

// MinIO는 가상호스트 방식 URL을 안 쓰므로 path-style 강제
const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const publicUrl = (bucket, key) => `${process.env.S3_PUBLIC_URL}/${bucket}/${key}`;

const extOf = (filename) => {
  const m = /\.([a-z0-9]+)$/i.exec(filename || '');
  return m ? m[1].toLowerCase() : 'jpg';
};

export async function uploadFile(bucket, file, prefix = '') {
  const key = `${prefix}${crypto.randomUUID()}.${extOf(file.name)}`;
  const body = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type || 'application/octet-stream',
    })
  );

  return publicUrl(bucket, key);
}

export async function deleteByUrl(url) {
  const prefix = `${process.env.S3_PUBLIC_URL}/`;
  if (!url?.startsWith(prefix)) return;

  const [bucket, ...rest] = url.slice(prefix.length).split('/');
  if (!bucket || !rest.length) return;

  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: rest.join('/') }));
}
