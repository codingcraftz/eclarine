import { ACCOUNT, BRAND } from '@/lib/pricing';
import { productById } from '@/lib/products';
import StoreFlow from '@/components/pay/StoreFlow';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await productById(id);
  if (!product) return { title: `${BRAND} — 결제`, robots: { index: false } };

  const brand = product.brand || BRAND;
  const title = `${product.name} · ${brand}`;
  const description = `${product.name} 결제 링크입니다. ${product.price.toLocaleString('ko-KR')}원부터 — 편하게 결제하세요.`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, siteName: brand },
  };
}

export default async function PayPage({ params }) {
  const { id } = await params;
  const product = await productById(id);

  if (!product || product.active === false) {
    return (
      <div className="flex-1 grid place-items-center px-8 text-center">
        <div>
          <div className="text-[40px] mb-4">🔗</div>
          <p className="text-[16px] font-bold text-[#1A1A1A] mb-1">지금은 구매할 수 없는 상품이에요</p>
          <p className="text-[14px] text-[#8A8A8A] leading-relaxed">
            링크가 만료되었거나 판매가 종료됐어요.
            <br />
            보내주신 분께 다시 요청해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <StoreFlow
      products={[product]}
      preselectedId={id}
      account={ACCOUNT}
      tossClientKey={process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY}
    />
  );
}
