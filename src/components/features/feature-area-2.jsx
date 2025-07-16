import React from "react";
import { Delivery, Discount, Refund, Support } from "@/svg";

export const feature_data = [
  {
    icon: <Delivery />,
    title: "8만원 이상 무료배송",
    subtitle: "전국 어디든 빠르고 안전하게 배송",
  },
  {
    icon: <Refund />,
    title: "원하는 사이즈 주문 제작",
    subtitle: "맞춤 제작/각인 가능 (문의 환영)",
  },
  {
    icon: <Discount />,
    title: "모든 주문 친절상담",
    subtitle: "카카오톡/전화/문자 문의 가능",
  },
  {
    icon: <Support />,
    title: "고객센터 09:00~18:00 운영",
    subtitle: "평일 09:00~18:00 (점심 12~13시)",
  },
];

const FeatureAreaTwo = () => {
  return (
    <section className={`tp-feature-area tp-feature-border-2 pb-80`}>
      <div className="container">
        <div className="tp-feature-inner-2">
          <div className="row align-items-center">
            {feature_data.map((item, i) => (
              <div key={i} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="tp-feature-item-2 d-flex align-items-start mb-40">
                  <div className="tp-feature-icon-2 mr-10">
                    <span>{item.icon}</span>
                  </div>
                  <div className="tp-feature-content-2">
                    <h3 className="tp-feature-title-2">{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAreaTwo;
