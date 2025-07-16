import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
// internal
import { supabaseService } from "@/lib/supabase";
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
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const all = await supabaseService.getAllProducts();
      // 현재 상품 제외, 최대 4개
      setRelatedProducts(all.filter((p) => p.id !== id).slice(0, 4));
    }
    fetchProducts();
  }, [id]);

  const content = (
    <Swiper
      {...slider_setting}
      modules={[Autoplay, Navigation]}
      className="tp-product-related-slider-active swiper-container mb-10"
    >
      {relatedProducts.map((item) => (
        <SwiperSlide key={item.id}>
          <ProductItem product={item} primary_style={true} />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return <div className="tp-product-related-slider">{content}</div>;
};

export default RelatedProducts;
