import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import useCartInfo from "@/hooks/use-cart-info";
import TossPaymentWidget from "@/components/payment/TossPaymentWidget";
import AddressSearch from "@/components/common/AddressSearch";
import SavedAddresses from "@/components/common/SavedAddresses";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const router = useRouter();
  const { cart_products } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { total } = useCartInfo();
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    addressDetail: "",
    isRemoteArea: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("카드");

  // 배송비 계산
  const baseShippingCost = total >= 80000 ? 0 : 3000;
  const remoteAreaCost = shippingInfo.isRemoteArea ? 3000 : 0;
  const totalShippingCost = baseShippingCost + remoteAreaCost;
  const finalAmount = total + totalShippingCost;

  // 포인트 및 할인 혜택 계산 (예시)
  const pointReward = Math.floor(finalAmount * 0.01); // 1% 적립
  const maxPointUse = Math.floor(finalAmount * 0.05); // 최대 5% 사용 가능

  // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
  useEffect(() => {
    if (cart_products.length === 0) {
      router.replace("/cart");
    }
  }, [cart_products, router]);

  // 폼 유효성 검사
  useEffect(() => {
    const { name, phone, email, address } = shippingInfo;
    const isValid = name && phone && email && address;
    setIsFormValid(isValid);

    // 배송 정보 저장
    if (isValid) {
      localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    }
  }, [shippingInfo]);

  // 전화번호 자동 하이픈
  const formatPhone = (value) => {
    const number = value.replace(/[^0-9]/g, "");
    if (number.length <= 3) return number;
    if (number.length <= 7) return number.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    return number.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
  };

  // 주문명 생성
  const getOrderName = () => {
    if (cart_products.length === 0) return "";
    if (cart_products.length === 1) return cart_products[0].title;
    return `${cart_products[0].title} 외 ${cart_products.length - 1}건`;
  };

  // 저장된 주소 선택 처리
  const handleSelectAddress = (address) => {
    setShippingInfo((prev) => ({
      ...prev,
      name: address.recipient_name,
      phone: address.phone,
      address: address.address,
      addressDetail: address.address_detail || "",
    }));
    setShowSavedAddresses(false);
  };

  return (
    <div className="checkout-page">
      <div className="container py-4">
        <div className="checkout-header mb-4">
          <h1>주문/결제</h1>
          <div className="checkout-steps">
            <span className="step active">주문결제</span>
            <span className="step-arrow">›</span>
            <span className="step">주문완료</span>
          </div>
        </div>

        <div className="row">
          {/* 왼쪽: 배송 정보 및 결제 수단 */}
          <div className="col-lg-8">
            {/* 배송지 정보 */}
            <div className="checkout-section">
              <div className="section-header">
                <h3>배송지</h3>
                {user && (
                  <button
                    type="button"
                    onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                    className="change-button"
                  >
                    {showSavedAddresses ? "직접 입력" : "배송지 변경"}
                  </button>
                )}
              </div>

              {showSavedAddresses ? (
                <SavedAddresses onSelect={handleSelectAddress} />
              ) : (
                <div className="delivery-info">
                  {shippingInfo.address ? (
                    <>
                      <div className="recipient-info">
                        <span className="name">{shippingInfo.name}</span>
                        <span className="phone">{shippingInfo.phone}</span>
                      </div>
                      <div className="address">
                        {shippingInfo.address}
                        {shippingInfo.addressDetail && ` ${shippingInfo.addressDetail}`}
                      </div>
                    </>
                  ) : (
                    <div className="no-address">
                      <AddressSearch
                        onComplete={(data) => {
                          setShippingInfo((prev) => ({
                            ...prev,
                            address: data.address,
                          }));
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 주문 상품 */}
            <div className="checkout-section">
              <div className="section-header">
                <h3>주문 상품</h3>
                <span className="item-count">{cart_products.length}개</span>
              </div>
              <div className="order-items">
                {cart_products.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.featured_image} alt={item.title} width={80} height={80} />
                    </div>
                    <div className="item-info">
                      <div className="item-name">{item.title}</div>
                      <div className="item-option">수량: {item.orderQuantity}개</div>
                      <div className="item-price">
                        ₩{(item.price * item.orderQuantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 결제 수단 */}
            <div className="checkout-section">
              <div className="section-header">
                <h3>결제 수단</h3>
              </div>
              <div className="payment-methods">
                <div className="payment-method-list">
                  <label
                    className={`payment-method-item ${
                      selectedPaymentMethod === "카드" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="카드"
                      checked={selectedPaymentMethod === "카드"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span className="method-name">카드</span>
                  </label>
                  <label
                    className={`payment-method-item ${
                      selectedPaymentMethod === "토스" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="토스"
                      checked={selectedPaymentMethod === "토스"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span className="method-name">토스</span>
                  </label>
                  <label
                    className={`payment-method-item ${
                      selectedPaymentMethod === "가상계좌" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="가상계좌"
                      checked={selectedPaymentMethod === "가상계좌"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <span className="method-name">가상계좌</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 결제 금액 */}
          <div className="col-lg-4">
            <div className="payment-summary">
              <div className="summary-header">
                <h3>결제 금액</h3>
              </div>
              <div className="summary-content">
                <div className="summary-row">
                  <span>주문 금액</span>
                  <span>₩{total.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>배송비</span>
                  <span>₩{totalShippingCost.toLocaleString()}</span>
                </div>
                {shippingInfo.isRemoteArea && (
                  <div className="summary-row text-danger">
                    <span>도서산간 추가배송비</span>
                    <span>+ ₩3,000</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>최종 결제 금액</span>
                  <span className="final-amount">₩{finalAmount.toLocaleString()}</span>
                </div>
                <div className="point-info">
                  <div className="point-row">
                    <span>적립 예정 포인트</span>
                    <span className="point">+ {pointReward.toLocaleString()}P</span>
                  </div>
                  <div className="point-row">
                    <span>최대 사용 가능 포인트</span>
                    <span className="point">{maxPointUse.toLocaleString()}P</span>
                  </div>
                </div>
              </div>
              {isFormValid && (
                <div className="payment-button-wrapper">
                  <TossPaymentWidget
                    amount={finalAmount}
                    orderId={`ORDER-${Date.now()}`}
                    orderName={getOrderName()}
                    customerEmail={shippingInfo.email}
                    customerName={shippingInfo.name}
                    customerMobilePhone={shippingInfo.phone.replace(/-/g, "")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .checkout-header {
          text-align: center;
          padding: 20px 0;
        }

        .checkout-steps {
          margin-top: 10px;
          color: #868e96;
        }

        .step.active {
          color: #0064ff;
          font-weight: bold;
        }

        .step-arrow {
          margin: 0 10px;
        }

        .checkout-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h3 {
          font-size: 18px;
          margin: 0;
        }

        .change-button {
          border: 1px solid #dee2e6;
          background: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          color: #495057;
          cursor: pointer;
        }

        .change-button:hover {
          background: #f8f9fa;
        }

        .delivery-info {
          padding: 16px;
          border: 1px solid #e9ecef;
          border-radius: 4px;
        }

        .recipient-info {
          margin-bottom: 8px;
        }

        .name {
          font-weight: bold;
          margin-right: 12px;
        }

        .phone {
          color: #495057;
        }

        .address {
          color: #495057;
          line-height: 1.5;
        }

        .no-address {
          text-align: center;
          padding: 20px;
          color: #868e96;
        }

        .order-items {
          border: 1px solid #e9ecef;
          border-radius: 4px;
        }

        .order-item {
          display: flex;
          padding: 16px;
          border-bottom: 1px solid #e9ecef;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-image {
          margin-right: 16px;
        }

        .item-image img {
          border-radius: 4px;
          object-fit: cover;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .item-option {
          font-size: 14px;
          color: #868e96;
          margin-bottom: 4px;
        }

        .item-price {
          font-weight: 500;
          color: #495057;
        }

        .payment-methods {
          padding: 16px;
          border: 1px solid #e9ecef;
          border-radius: 4px;
        }

        .payment-method-list {
          display: flex;
          gap: 12px;
        }

        .payment-method-item {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-method-item.active {
          border-color: #0064ff;
          background-color: #f8f9ff;
        }

        .payment-method-item input {
          margin-right: 8px;
        }

        .method-name {
          font-size: 14px;
          font-weight: 500;
        }

        .payment-summary {
          background: white;
          border-radius: 8px;
          padding: 24px;
          position: sticky;
          top: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .summary-header {
          margin-bottom: 20px;
        }

        .summary-header h3 {
          font-size: 18px;
          margin: 0;
        }

        .summary-content {
          border-top: 1px solid #e9ecef;
          padding-top: 16px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          color: #495057;
        }

        .summary-row.total {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e9ecef;
          font-weight: bold;
          color: black;
        }

        .final-amount {
          color: #0064ff;
          font-size: 20px;
        }

        .point-info {
          margin-top: 16px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .point-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #495057;
          margin-bottom: 8px;
        }

        .point-row:last-child {
          margin-bottom: 0;
        }

        .point {
          color: #0064ff;
          font-weight: 500;
        }

        .text-danger {
          color: #dc3545;
        }

        @media (max-width: 768px) {
          .checkout-section,
          .payment-summary {
            padding: 16px;
          }

          .payment-method-list {
            flex-direction: column;
          }

          .payment-method-item {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
