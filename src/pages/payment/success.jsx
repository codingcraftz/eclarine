import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/features/cartSlice";
import { toast } from "react-toastify";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const { cart_products } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const confirmPayment = async () => {
      const { paymentKey, orderId, amount } = router.query;

      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        setIsProcessing(false);
        return;
      }

      try {
        // 1. 결제 승인 요청
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "결제 승인 처리 중 오류가 발생했습니다.");
        }

        // 저장된 배송 정보 가져오기
        const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo") || "{}");

        if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
          throw new Error("배송 정보가 올바르지 않습니다.");
        }

        // 2. 주문 정보 저장
        const orderResponse = await fetch("/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            paymentKey,
            amount: Number(amount),
            orderItems: cart_products.map((item) => ({
              id: item.id,
              title: item.title,
              price: item.price,
              quantity: item.orderQuantity,
              featured_image: item.featured_image,
            })),
            shippingInfo: {
              name: shippingInfo.name,
              phone: shippingInfo.phone,
              email: shippingInfo.email,
              address: shippingInfo.address,
              addressDetail: shippingInfo.addressDetail,
              isRemoteArea: shippingInfo.isRemoteArea,
            },
            userId: user?.id,
          }),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          console.error("주문 저장 실패:", errorData);
          throw new Error(errorData.message || "주문 정보 저장 중 오류가 발생했습니다.");
        }

        // 3. 장바구니 비우기
        dispatch(clearCart());
        localStorage.removeItem("shippingInfo");

        // 4. 성공 메시지 표시
        toast.success("결제가 완료되었습니다!");

        // 5. 주문 완료 페이지로 이동
        router.replace("/mypage/orders");
      } catch (error) {
        console.error("결제 승인 실패:", error);
        setError(error.message || "결제 승인 처리 중 오류가 발생했습니다.");
      } finally {
        setIsProcessing(false);
      }
    };

    if (router.isReady) {
      confirmPayment();
    }
  }, [router.isReady, router.query, dispatch, cart_products, user]);

  if (isProcessing) {
    return (
      <div className="payment-success-page">
        <div className="loading-spinner"></div>
        <h2>결제 승인 처리 중...</h2>
        <p>잠시만 기다려주세요.</p>
        <style jsx>{`
          .payment-success-page {
            text-align: center;
            padding: 40px 20px;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-success-page">
        <div className="error-icon">❌</div>
        <h2>결제 승인 실패</h2>
        <p>{error}</p>
        <button onClick={() => router.push("/cart")}>장바구니로 돌아가기</button>
        <style jsx>{`
          .payment-success-page {
            text-align: center;
            padding: 40px 20px;
          }
          .error-icon {
            font-size: 48px;
            margin-bottom: 20px;
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
  }

  return null;
};

export default PaymentSuccessPage;
