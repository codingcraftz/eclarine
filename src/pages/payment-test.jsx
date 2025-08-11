import { useState } from "react";
import TossPaymentWidget from "@/components/payment/TossPaymentWidget";

const PaymentTestPage = () => {
  const [amount, setAmount] = useState(1000); // 기본값 1,000원

  return (
    <div className="payment-test-page">
      <h1>결제 테스트</h1>

      {/* 테스트용 금액 입력 */}
      <div className="amount-input">
        <label>결제 금액:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="1000"
          step="1000"
        />
        <span>원</span>
      </div>

      {/* 결제 위젯 */}
      <div className="payment-widget-container">
        <TossPaymentWidget
          amount={amount}
          orderId={`TEST-${Date.now()}`}
          orderName="테스트 상품"
          customerEmail="test@example.com"
          customerName="테스트"
        />
      </div>

      {/* 테스트 카드 정보 안내 */}
      <div className="test-info">
        <h2>🔍 테스트 결제 정보</h2>
        <div className="card-info">
          <h3>테스트 카드 정보</h3>
          <ul>
            <li>카드번호: 4111 1111 1111 1111</li>
            <li>만료일: 12/24</li>
            <li>CVC: 123</li>
            <li>비밀번호: 00</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .payment-test-page {
          max-width: 800px;
          margin: 40px auto;
          padding: 0 20px;
        }

        h1 {
          text-align: center;
          margin-bottom: 30px;
        }

        .amount-input {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .amount-input input {
          width: 150px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .payment-widget-container {
          margin-bottom: 40px;
        }

        .test-info {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 40px;
        }

        .test-info h2 {
          font-size: 1.2rem;
          margin-bottom: 20px;
        }

        .card-info {
          background-color: white;
          padding: 15px;
          border-radius: 4px;
        }

        .card-info h3 {
          font-size: 1rem;
          margin-bottom: 10px;
          color: #495057;
        }

        .card-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .card-info li {
          margin-bottom: 8px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default PaymentTestPage;
