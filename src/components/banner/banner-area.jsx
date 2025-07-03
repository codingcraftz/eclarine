import React from "react";
import Link from "next/link";
// internal
import { ArrowRight } from "@/svg";
import banner_1 from "@assets/img/product/banner/product-banner-1.jpg";
import banner_2 from "@assets/img/product/banner/product-banner-2.jpg";

// banner item
function BannerItem({ sm = false, bg, title, subtitle, discount }) {
  return (
    <div
      className={`tp-banner-item ${
        sm ? "tp-banner-item-sm" : ""
      } tp-banner-height p-relative mb-30 z-index-1 fix`}
    >
      <div
        className="tp-banner-thumb include-bg transition-3"
        style={{ backgroundImage: `url(${bg.src})` }}
      ></div>
      <div className="tp-banner-content">
        {!sm && <span>{subtitle}</span>}
        <h3 className="tp-banner-title">
          <Link href="/shop">{title}</Link>
        </h3>
        {sm && <p>{discount}</p>}
        <div className="tp-banner-btn">
          <Link href="/shop" className="tp-link-btn">
            지금 쇼핑하기
            <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

const BannerArea = () => {
  return (
    <section className="tp-banner-area pb-70">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <BannerItem
              bg={banner_1}
              subtitle="신상품 컬렉션"
              title={
                <>
                  925 실버 <br /> 프리미엄 악세서리
                </>
              }
            />
          </div>
          <div className="col-xl-4 col-lg-5">
            <BannerItem
              sm={true}
              bg={banner_2}
              title={
                <>
                  써지컬 스틸 <br /> 피어싱
                </>
              }
              discount="최대 30% 할인"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerArea;
