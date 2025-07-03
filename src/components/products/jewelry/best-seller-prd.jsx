import React from "react";
import { Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// internal
import ProductItem from "./product-item";
import { accessory_products } from "@/data/accessory-data";

// slider setting
const slider_setting = {
  slidesPerView: 4,
  spaceBetween: 24,
  scrollbar: {
    el: ".tp-best-swiper-scrollbar",
    draggable: true,
    dragClass: "tp-swiper-scrollbar-drag",
    snapOnRelease: true,
  },

  breakpoints: {
    1200: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
};

const BestSellerPrd = () => {
  // MOCK 데이터에서 베스트셀러 상품 가져오기 (is_bestseller가 true인 상품들)
  const bestSellerProducts = accessory_products
    .filter((product) => product.is_bestseller)
    .slice(0, 8);

  const content = (
    <Swiper
      {...slider_setting}
      modules={[Scrollbar]}
      className="tp-best-slider-active swiper-container mb-10"
    >
      {bestSellerProducts.map((item) => (
        <SwiperSlide key={item._id} className="tp-best-item-4">
          <ProductItem product={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <>
      <section className="tp-best-area pt-115">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-50 text-center">
                <span className="tp-section-title-pre-4">이주의 베스트셀러</span>
                <h3 className="tp-section-title-4">가장 사랑받는 악세서리</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-best-slider">
                {content}
                <div className="tp-best-swiper-scrollbar tp-swiper-scrollbar"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BestSellerPrd;
