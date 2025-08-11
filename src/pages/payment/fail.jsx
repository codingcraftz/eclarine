import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const PaymentFailPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { code, message, orderId } = router.query;

      // 에러 메시지 표시
      if (message) {
        toast.error(decodeURIComponent(message));
      }

      // 3초 후 장바구니 페이지로 이동
      const timer = setTimeout(() => {
        router.replace("/cart");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router.isReady, router.query]);

  return (
    <div className="payment-fail-page">
      <h2>결제 실패</h2>
      <p>결제 처리 중 문제가 발생했습니다.</p>
      <p>잠시 후 장바구니 페이지로 이동합니다.</p>
      <button onClick={() => router.push("/cart")}>장바구니로 돌아가기</button>

      <style jsx>{`
        .payment-fail-page {
          text-align: center;
          padding: 40px 20px;
        }
        h2 {
          color: #e03131;
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 10px;
          color: #495057;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #0064ff;
          color: white;
          cursor: pointer;
        }
        button:hover {
          background-color: #0052cc;
        }
      `}</style>
    </div>
  );
};

export default PaymentFailPage;
