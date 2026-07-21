import { isSignedIn } from '@/lib/admin-auth';
import { allProducts, createProduct, deleteProduct, updateProduct } from '@/lib/products';
import { deleteByUrl, uploadFile, PRODUCT_BUCKET } from '@/lib/storage';

export const runtime = 'nodejs';

const unauthorized = () => Response.json({ error: '인증이 필요합니다.' }, { status: 401 });

const toInt = (v, def = 0) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : def;
};

// 옵션 가감액은 음수 허용 (묶음 할인)
const toSignedInt = (v, def = 0) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? n : def;
};

function parseOptions(raw) {
  let arr;
  try {
    arr = JSON.parse(raw || '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];

  return arr
    .map((o, i) => ({
      id: String(o.id || `opt${i + 1}`),
      label: String(o.label || '').trim(),
      cashAdd: toSignedInt(o.cashAdd, 0),
      cardAdd: toSignedInt(o.cardAdd, 0),
      imageUrl: o.imageUrl || null,
    }))
    .filter((o) => o.label);
}

export async function GET() {
  if (!(await isSignedIn())) return unauthorized();
  return Response.json({ products: await allProducts() });
}

export async function POST(request) {
  if (!(await isSignedIn())) return unauthorized();

  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const editId = String(form.get('id') ?? '').trim();
  const name = String(form.get('name') ?? '').trim();
  const price = toInt(form.get('price'), 0);
  const listPriceRaw = form.get('listPrice');
  const cardPriceRaw = form.get('cardPrice');
  const options = parseOptions(form.get('options'));
  const image = form.get('image');

  if (!name) return Response.json({ error: '상품명을 입력해주세요.' }, { status: 400 });
  if (price <= 0) return Response.json({ error: '현금가를 올바르게 입력해주세요.' }, { status: 400 });

  try {
    // option_image_<i> 로 새 파일이 온 옵션만 교체, 나머지는 기존 imageUrl 유지
    for (let i = 0; i < options.length; i++) {
      const file = form.get(`option_image_${i}`);
      if (file?.size > 0) options[i].imageUrl = await uploadFile(PRODUCT_BUCKET, file);
    }

    const fields = {
      name,
      brand: String(form.get('brand') ?? '').trim() || null,
      price,
      listPrice: listPriceRaw ? toInt(listPriceRaw, 0) : null,
      cardPrice: cardPriceRaw ? toInt(cardPriceRaw, 0) : null,
      shippingFee: toInt(form.get('shippingFee'), 0),
      cardShippingFee: toInt(form.get('cardShippingFee'), 0),
      options,
    };
    if (image?.size > 0) fields.imageUrl = await uploadFile(PRODUCT_BUCKET, image);

    const product = editId
      ? await updateProduct(editId, fields)
      : await createProduct({ ...fields, imageUrl: fields.imageUrl ?? null, active: true });

    if (!product) return Response.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 });
    return Response.json({ product });
  } catch {
    return Response.json({ error: '저장에 실패했어요. 다시 시도해 주세요.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!(await isSignedIn())) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  if (!body.id) return Response.json({ error: 'id가 필요합니다.' }, { status: 400 });

  const product = await updateProduct(body.id, { active: Boolean(body.active) });
  if (!product) return Response.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 });

  return Response.json({ product });
}

export async function DELETE(request) {
  if (!(await isSignedIn())) return unauthorized();

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ error: 'id가 필요합니다.' }, { status: 400 });

  const product = await deleteProduct(id);
  if (!product) return Response.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 });

  const urls = [product.imageUrl, ...(product.options || []).map((o) => o.imageUrl)].filter(Boolean);
  await Promise.all(urls.map((url) => deleteByUrl(url).catch(() => {})));

  return Response.json({ ok: true });
}
