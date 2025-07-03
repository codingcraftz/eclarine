import React from "react";
import Link from "next/link";
import useCartInfo from "@/hooks/use-cart-info";
import { useState } from "react";

const CartCheckout = () => {
  const { total } = useCartInfo();
  const [isRemoteArea, setIsRemoteArea] = useState(false);

  // 기본 배송비 자동 계산 (8만원 미만 3,000원, 이상 무료)
  const baseShippingCost = total >= 80000 ? 0 : 3000;

  // 도서산간 추가비용 (선택 시에만)
  const remoteAreaCost = isRemoteArea ? 3000 : 0;

  // 총 배송비
  const totalShippingCost = baseShippingCost + remoteAreaCost;

  // handle remote area selection
  const handleRemoteAreaChange = (checked) => {
    setIsRemoteArea(checked);
  };
  return (
    <div className="tp-cart-checkout-wrapper">
      <div className="tp-cart-checkout-top d-flex align-items-center justify-content-between">
        <span className="tp-cart-checkout-top-title">소계</span>
        <span className="tp-cart-checkout-top-price">₩{total.toLocaleString()}</span>
      </div>
      <div className="tp-cart-checkout-shipping">
        <h4 className="tp-cart-checkout-shipping-title">배송</h4>
        <div className="tp-cart-checkout-shipping-option-wrapper">
          {/* 기본 배송비 자동 표시 */}
          <div
            className="tp-cart-checkout-shipping-info"
            style={{ marginBottom: "10px", padding: "8px 0" }}
          >
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
          <div className="tp-cart-checkout-shipping-option">
            <input
              id="remote_area"
              type="checkbox"
              checked={isRemoteArea}
              onChange={(e) => handleRemoteAreaChange(e.target.checked)}
            />
            <label htmlFor="remote_area" style={{ cursor: "pointer", marginLeft: "8px" }}>
              제주, 도서산간 지역 (+₩3,000)
            </label>
          </div>
        </div>
      </div>
      {/* 배송비 표시 */}
      {totalShippingCost > 0 && (
        <div
          className="tp-cart-checkout-shipping-cost d-flex align-items-center justify-content-between"
          style={{ paddingTop: "10px", borderTop: "1px solid #e0e0e0", marginTop: "10px" }}
        >
          <span>배송비</span>
          <span>₩{totalShippingCost.toLocaleString()}</span>
        </div>
      )}

      <div className="tp-cart-checkout-total d-flex align-items-center justify-content-between">
        <span>총계</span>
        <span>₩{(total + totalShippingCost).toLocaleString()}</span>
      </div>
      <div className="tp-cart-checkout-proceed">
        <Link href="/checkout" className="tp-cart-checkout-btn w-100">
          결제 진행
        </Link>
      </div>
    </div>
  );
};

export default CartCheckout;
