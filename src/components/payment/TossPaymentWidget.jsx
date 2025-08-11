import { useEffect, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { toast } from "react-toastify";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

const TossPaymentWidget = ({
  amount,
  orderId,
  orderName,
  customerEmail,
  customerName,
  customerMobilePhone,
  onSuccess,
  onFail,
}) => {
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  // 결제 위젯 초기화
  useEffect(() => {
    async function initializePayments() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        // 비회원 결제 사용
        const widgetsInstance = tossPayments.widgets({ customerKey: ANONYMOUS });
        setWidgets(widgetsInstance);
      } catch (error) {
        console.error("토스페이먼츠 초기화 실패:", error);
        toast.error("결제 시스템을 불러오는데 실패했습니다.");
      }
    }

    initializePayments();
  }, []);

  // 결제 UI 렌더링
  useEffect(() => {
    async function renderWidgets() {
      if (!widgets || !amount) return;

      try {
        // 결제 금액 설정
        await widgets.setAmount({
          currency: "KRW",
          value: amount,
        });

        // 결제 UI와 이용약관 렌더링
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-methods",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "DEFAULT",
          }),
        ]);

        setReady(true);
      } catch (error) {
        console.error("결제 위젯 렌더링 실패:", error);
        toast.error("결제 화면을 불러오는데 실패했습니다.");
      }
    }

    renderWidgets();

    return () => {
      // 컴포넌트 언마운트 시 위젯 정리
      if (widgets) {
        try {
          const paymentMethodsEl = document.querySelector("#payment-methods");
          const agreementEl = document.querySelector("#agreement");
          if (paymentMethodsEl) paymentMethodsEl.innerHTML = "";
          if (agreementEl) agreementEl.innerHTML = "";
        } catch (error) {
          console.error("위젯 정리 중 오류:", error);
        }
      }
    };
  }, [widgets, amount]);

  // 결제 요청 처리
  const handlePayment = async () => {
    if (!widgets || !ready) return;

    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        customerEmail,
        customerName,
        customerMobilePhone,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      // 결제 취소는 에러가 아닌 정상적인 사용자 행동으로 처리
      if (error.message === "취소되었습니다.") {
        toast.info("결제가 취소되었습니다.");
        return;
      }

      // 실제 에러인 경우에만 에러 처리
      console.error("결제 요청 실패:", error);
      toast.error("결제 처리 중 오류가 발생했습니다.");
      if (onFail) onFail(error);
    }
  };

  return (
    <div className="toss-payment-widget">
      {/* 결제수단 선택 UI */}
      <div id="payment-methods" style={{ width: "100%", minHeight: "200px" }} />

      {/* 약관 동의 UI */}
      <div id="agreement" style={{ width: "100%", marginTop: "20px" }} />

      {/* 결제하기 버튼 */}
      <button
        className={`payment-button ${!ready ? "disabled" : ""}`}
        onClick={handlePayment}
        disabled={!ready}
      >
        {ready ? `${amount.toLocaleString()}원 결제하기` : "결제 위젯 로딩중..."}
      </button>

      <style jsx>{`
        .toss-payment-widget {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .payment-button {
          width: 100%;
          height: 50px;
          margin-top: 20px;
          border: none;
          border-radius: 8px;
          background-color: #0064ff;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .payment-button:hover:not(.disabled) {
          background-color: #0052cc;
        }
        .payment-button.disabled {
          background-color: #e9ecef;
          color: #adb5bd;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default TossPaymentWidget;
