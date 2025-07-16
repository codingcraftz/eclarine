import React, { useState, useEffect } from "react";
import { Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// internal
import ProductItem from "./product-item";
import { supabaseService } from "@/lib/supabase";

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
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBestSellerProducts();
  }, []);

  const loadBestSellerProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseService.getBestsellerProducts(8);
      setBestSellerProducts(data || []);
    } catch (err) {
      console.error("베스트셀러 상품 로딩 오류:", err);
      setError("베스트셀러 상품을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
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
            <div className="col-xl-12 text-center">
              <p className="text-danger">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (bestSellerProducts.length === 0) {
    return (
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
            <div className="col-xl-12 text-center">
              <p>베스트셀러 상품이 없습니다.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const content = (
    <Swiper
      {...slider_setting}
      modules={[Scrollbar]}
      className="tp-best-slider-active swiper-container mb-10"
    >
      {bestSellerProducts.map((item) => (
        <SwiperSlide key={item.id} className="tp-best-item-4">
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
