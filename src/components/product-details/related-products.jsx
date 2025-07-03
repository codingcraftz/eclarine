import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
// internal
import { accessory_products } from "@/data/accessory-data";
import ProductItem from "../products/beauty/product-item";

// slider setting
const slider_setting = {
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: ".tp-related-slider-button-next",
    prevEl: ".tp-related-slider-button-prev",
  },
  autoplay: {
    delay: 5000,
  },
  breakpoints: {
    1200: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 3,
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

const RelatedProducts = ({ id }) => {
  // MOCK 데이터에서 현재 상품을 제외한 다른 상품들을 관련 상품으로 표시
  const relatedProducts = accessory_products
    .filter((product) => product._id.toString() !== id.toString())
    .slice(0, 4);

  const content = (
    <Swiper
      {...slider_setting}
      modules={[Autoplay, Navigation]}
      className="tp-product-related-slider-active swiper-container mb-10"
    >
      {relatedProducts.map((item) => (
        <SwiperSlide key={item._id}>
          <ProductItem product={item} primary_style={true} />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return <div className="tp-product-related-slider">{content}</div>;
};

export default RelatedProducts;
