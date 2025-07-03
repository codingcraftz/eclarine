import React from "react";
import Image from "next/image";
import payment_option_img from "@assets/img/product/icons/payment-option.png";

const DetailsBottomInfo = ({ sku, category, tag }) => {
  return (
    <>
      {/* product-details-query */}
      <div className="tp-product-details-query">
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>상품코드: </span>
          <p>{sku}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>카테고리: </span>
          <p>{category}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>태그: </span>
          <p>{tag}</p>
        </div>
      </div>

      {/* product-details-social */}
      <div className="tp-product-details-social">
        <span>공유하기: </span>
        <a href="#">
          <i className="fa-brands fa-facebook-f"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-twitter"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-linkedin-in"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-vimeo-v"></i>
        </a>
      </div>

      {/* product-details-msg */}
      <div className="tp-product-details-msg mb-15">
        <ul>
          <li>✅ 8만원 이상 무료배송</li>
          <li>✅ 평일 12시 이전 주문시 당일 발송</li>
        </ul>
      </div>

      {/* product-details-payment */}
      <div className="tp-product-details-payment d-flex align-items-center flex-wrap justify-content-between">
        <p>
          안전하고 간편한 <br />
          토스페이먼츠 결제
        </p>
        <div className="tp-payment-methods">
          <span className="payment-badge">💳 신용카드</span>
          <span className="payment-badge">🏦 계좌이체</span>
          <span className="payment-badge">📱 간편결제</span>
        </div>
      </div>
    </>
  );
};

export default DetailsBottomInfo;
