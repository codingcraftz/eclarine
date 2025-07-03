import { useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
// internal
import useCartInfo from "@/hooks/use-cart-info";
import ErrorMsg from "../common/error-msg";

const CheckoutOrderArea = ({ checkoutData }) => {
  const {
    handleShippingCost,
    cartTotal = 0,
    stripe,
    isCheckoutSubmit,
    clientSecret,
    register,
    errors,
    showCard,
    setShowCard,
    shippingCost,
    discountAmount,
  } = checkoutData;
  const { cart_products } = useSelector((state) => state.cart);
  const { total } = useCartInfo();
  return (
    <div className="tp-checkout-place white-bg">
      <h3 className="tp-checkout-place-title">주문 내역</h3>

      <div className="tp-order-info-list">
        <ul>
          {/*  header */}
          <li className="tp-order-info-list-header">
            <h4>상품</h4>
            <h4>합계</h4>
          </li>

          {/*  item list */}
          {cart_products.map((item) => (
            <li key={item._id} className="tp-order-info-list-desc">
              <p>
                {item.title} <span> x {item.orderQuantity}</span>
              </p>
              <span>₩{item.price.toLocaleString()}</span>
            </li>
          ))}

          {/*  shipping */}
          <li className="tp-order-info-list-shipping">
            <span>배송</span>
            <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
              {/* 기본 배송비 자동 표시 */}
              <div style={{ marginBottom: "10px", textAlign: "right" }}>
                {total >= 80000 ? (
                  <div style={{ color: "#0989FF", fontWeight: "600" }}>
                    ✓ 무료배송 (80,000원 이상 구매)
                  </div>
                ) : (
                  <div>
                    기본 배송비: <span style={{ fontWeight: "600" }}>₩3,000</span>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                      80,000원 이상 구매 시 무료배송
                    </div>
                  </div>
                )}
              </div>

              {/* 도서산간 지역 선택 옵션 */}
              <span>
                <input
                  {...register(`remoteArea`)}
                  id="remote_area_checkout"
                  type="checkbox"
                  name="remoteArea"
                  onChange={(e) => handleShippingCost(e.target.checked ? 3000 : 0)}
                />
                <label
                  htmlFor="remote_area_checkout"
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                >
                  제주, 도서산간 지역 (+₩3,000)
                </label>
              </span>
            </div>
          </li>

          {/*  subtotal */}
          <li className="tp-order-info-list-subtotal">
            <span>소계</span>
            <span>₩{total.toLocaleString()}</span>
          </li>

          {/*  shipping cost */}
          <li className="tp-order-info-list-subtotal">
            <span>배송비</span>
            <span>
              {total >= 80000 ? (
                <span style={{ color: "#0989FF" }}>무료</span>
              ) : (
                `₩${shippingCost.toLocaleString()}`
              )}
            </span>
          </li>

          {/* discount */}
          <li className="tp-order-info-list-subtotal">
            <span>할인</span>
            <span>₩{discountAmount.toLocaleString()}</span>
          </li>

          {/* total */}
          <li className="tp-order-info-list-total">
            <span>총계</span>
            <span>₩{parseFloat(cartTotal).toLocaleString()}</span>
          </li>
        </ul>
      </div>
      <div className="tp-checkout-payment">
        <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Payment Option is required!`,
            })}
            type="radio"
            id="back_transfer"
            name="payment"
            value="Card"
          />
          <label
            onClick={() => setShowCard(true)}
            htmlFor="back_transfer"
            data-bs-toggle="direct-bank-transfer"
          >
            신용카드
          </label>
          {showCard && (
            <div className="direct-bank-transfer">
              <div className="payment_card">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
          <ErrorMsg msg={errors?.payment?.message} />
        </div>
        <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Payment Option is required!`,
            })}
            onClick={() => setShowCard(false)}
            type="radio"
            id="cod"
            name="payment"
            value="COD"
          />
          <label htmlFor="cod">착불 결제</label>
          <ErrorMsg msg={errors?.payment?.message} />
        </div>
      </div>

      <div className="tp-checkout-btn-wrapper">
        <button
          type="submit"
          disabled={!stripe || isCheckoutSubmit}
          className="tp-checkout-btn w-100"
        >
          주문하기
        </button>
      </div>
    </div>
  );
};

export default CheckoutOrderArea;
