import { BRAND, FORM_ACCOUNT, KAKAO_CHANNEL } from '@/lib/pricing';
import OrderForm from '@/components/pay/OrderForm';

export const metadata = {
  title: `${BRAND} 주문서`,
  description: '방송에서 고르신 상품의 주문서를 작성해 주세요.',
  robots: { index: false, follow: false },
};

export default function FormPage() {
  return <OrderForm account={FORM_ACCOUNT} kakaoChannel={KAKAO_CHANNEL} />;
}
