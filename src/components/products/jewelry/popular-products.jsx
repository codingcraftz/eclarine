import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar } from "swiper";
// internal
import { supabaseService } from "@/lib/supabase";
import ProductSliderItem from "./product-slider-item";

// slider setting
const slider_setting = {
  slidesPerView: 5,
  spaceBetween: 25,
  pagination: {
    el: ".tp-category-slider-dot-4",
    clickable: true,
  },
  scrollbar: {
    el: ".tp-category-swiper-scrollbar",
    draggable: true,
    dragClass: "tp-swiper-scrollbar-drag",
    snapOnRelease: true,
  },
  breakpoints: {
    1400: {
      slidesPerView: 5,
    },
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

const PopularProducts = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPopularProducts();
  }, []);

  const loadPopularProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseService.getPopularProducts(8);
      setPopularProducts(data || []);
    } catch (err) {
      console.error("인기 상품 로딩 오류:", err);
      setError("인기 상품을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <Swiper
      {...slider_setting}
      modules={[Scrollbar, Pagination]}
      className="tp-category-slider-active-4 swiper-container mb-70"
    >
      {popularProducts.map((item) => (
        <SwiperSlide key={item.id}>
          <ProductSliderItem product={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  if (loading) {
    return (
      <section
        className="tp-category-area pt-115 pb-105 tp-category-plr-85"
        style={{ backgroundColor: `#EFF1F5` }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-60 text-center">
                <span className="tp-section-title-pre-4">카테고리별 쇼핑</span>
                <h3 className="tp-section-title-4">에끌라린 인기 상품</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">로딩 중...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="tp-category-area pt-115 pb-105 tp-category-plr-85"
        style={{ backgroundColor: `#EFF1F5` }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-60 text-center">
                <span className="tp-section-title-pre-4">카테고리별 쇼핑</span>
                <h3 className="tp-section-title-4">에끌라린 인기 상품</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12 text-center">
              <p className="text-danger">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (popularProducts.length === 0) {
    return (
      <section
        className="tp-category-area pt-115 pb-105 tp-category-plr-85"
        style={{ backgroundColor: `#EFF1F5` }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-60 text-center">
                <span className="tp-section-title-pre-4">카테고리별 쇼핑</span>
                <h3 className="tp-section-title-4">에끌라린 인기 상품</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12 text-center">
              <p>인기 상품이 없습니다.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="tp-category-area pt-115 pb-105 tp-category-plr-85"
        style={{ backgroundColor: `#EFF1F5` }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-4 mb-60 text-center">
                <span className="tp-section-title-pre-4">카테고리별 쇼핑</span>
                <h3 className="tp-section-title-4">에끌라린 인기 상품</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-category-slider-4">
                {content}
                <div className="tp-category-swiper-scrollbar tp-swiper-scrollbar"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularProducts;
