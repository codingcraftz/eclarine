import { after } from 'next/server';

import { createOrderForm } from '@/lib/order-forms';
import { notifyOrderForm } from '@/lib/notify';
import { uploadFile, CAPTURE_BUCKET } from '@/lib/storage';

export const runtime = 'nodejs';

const MAX_FILES = 10;

const clip = (v, max = 500) => String(v ?? '').trim().slice(0, max);

export async function POST(request) {
  let data;
  try {
    data = await request.formData();
  } catch {
    return Response.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const form = {
    nickname: clip(data.get('nickname'), 100),
    name: clip(data.get('name'), 100),
    phone: clip(data.get('phone'), 20),
    address: clip(data.get('address')),
    addressDetail: clip(data.get('addressDetail')),
    payment: data.get('payment') === '카드결제' ? '카드결제' : '계좌이체',
    amount: Math.max(0, Math.round(Number(data.get('amount')) || 0)),
    request: clip(data.get('request'), 1000),
  };

  const files = data.getAll('files').filter((f) => typeof f?.arrayBuffer === 'function');

  if (!form.nickname || !form.name || !form.phone || !form.address) {
    return Response.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 });
  }
  if (form.amount <= 0) {
    return Response.json({ error: '금액을 입력해주세요.' }, { status: 400 });
  }
  if (files.length === 0) {
    return Response.json({ error: '캡쳐사진을 올려주세요.' }, { status: 400 });
  }

  let imageUrls;
  try {
    imageUrls = await Promise.all(
      files.slice(0, MAX_FILES).map((file) => uploadFile(CAPTURE_BUCKET, file, 'form/'))
    );
  } catch {
    return Response.json({ error: '사진 업로드에 실패했어요. 다시 시도해 주세요.' }, { status: 502 });
  }

  const row = await createOrderForm(form, imageUrls);

  after(() => notifyOrderForm({ form: row, imageUrls }));

  return Response.json({ ok: true });
}
