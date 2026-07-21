import { ACCOUNT, BRAND } from '@/lib/pricing';
import { activeProducts } from '@/lib/products';
import StoreFlow from '@/components/pay/StoreFlow';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: `${BRAND} 라이브`,
  description: '당신을 더 빛나게 — 에끌라린. 편하게 골라서 현금이체·카드로 결제하세요.',
  robots: { index: false, follow: false },
};

export default async function ShopPage() {
  const products = await activeProducts();

  return (
    <StoreFlow
      products={products}
      account={ACCOUNT}
      tossClientKey={process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY}
    />
  );
}
