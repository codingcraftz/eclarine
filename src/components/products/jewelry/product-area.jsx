import React, { useEffect, useRef, useState } from "react";
import ProductItem from "./product-item";
import { supabaseService } from "@/lib/supabase";

const ProductArea = () => {
  const [activeTab, setActiveTab] = useState("전체 상품");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const activeRef = useRef(null);
  const marker = useRef(null);

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    loadData();
  }, []);

  // 탭 변경 시 마커 위치 업데이트
  useEffect(() => {
    if (activeRef.current && marker.current) {
      marker.current.style.left = activeRef.current.offsetLeft + "px";
      marker.current.style.width = activeRef.current.offsetWidth + "px";
    }
  }, [activeTab]);

  // 탭 변경 시 상품 필터링
  useEffect(() => {
    filterProducts();
  }, [activeTab, products]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 상품과 카테고리 데이터 동시 로딩
      const [productsData, categoriesData] = await Promise.all([
        supabaseService.getActiveProducts(),
        supabaseService.getCategories(),
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error("데이터 로딩 오류:", err);
      setError("상품 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (activeTab === "전체 상품") {
      setFilteredProducts(products);
    } else {
      // 선택된 탭에 맞는 카테고리 찾기
      const selectedCategory = categories.find((cat) => cat.name === activeTab);
      if (selectedCategory) {
        const filtered = products.filter((product) => product.category_id === selectedCategory.id);
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts([]);
      }
    }
  };

  const handleActiveTab = (e, tab) => {
    setActiveTab(tab);
  };

  // 탭 목록 생성 (전체 상품 + 카테고리들)
  const tabs = ["전체 상품", ...categories.map((cat) => cat.name)];

  if (loading) {
    return (
      <section className="tp-product-area pt-115 pb-80">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-xl-6 col-lg-6">
              <div className="tp-section-title-wrapper-4 mb-40 text-center text-lg-start">
                <span className="tp-section-title-pre-4">상품 컬렉션</span>
                <h3 className="tp-section-title-4">다양한 악세서리를 만나보세요</h3>
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
      <section className="tp-product-area pt-115 pb-80">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-xl-6 col-lg-6">
              <div className="tp-section-title-wrapper-4 mb-40 text-center text-lg-start">
                <span className="tp-section-title-pre-4">상품 컬렉션</span>
                <h3 className="tp-section-title-4">다양한 악세서리를 만나보세요</h3>
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

  const content = (
    <>
      <div className="row align-items-end">
        <div className="col-xl-6 col-lg-6">
          <div className="tp-section-title-wrapper-4 mb-40 text-center text-lg-start">
            <span className="tp-section-title-pre-4">상품 컬렉션</span>
            <h3 className="tp-section-title-4">다양한 악세서리를 만나보세요</h3>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6">
          <div className="tp-product-tab-2 tp-product-tab-3  tp-tab mb-45">
            <div className="tp-product-tab-inner-3 d-flex align-items-center justify-content-center justify-content-lg-end">
              <nav>
                <div
                  className="nav nav-tabs justify-content-center tp-product-tab tp-tab-menu p-relative"
                  id="nav-tab"
                  role="tablist"
                >
                  {tabs.map((tab, i) => (
                    <button
                      key={i}
                      ref={activeTab === tab ? activeRef : null}
                      onClick={(e) => handleActiveTab(e, tab)}
                      className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`}
                    >
                      {tab}
                      <span className="tp-product-tab-tooltip">{filteredProducts.length}</span>
                    </button>
                  ))}

                  <span
                    ref={marker}
                    id="productTabMarker"
                    className="tp-tab-line d-none d-sm-inline-block"
                  ></span>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prd) => (
            <div key={prd.id} className="col-xl-3 col-lg-4 col-sm-6">
              <ProductItem product={prd} />
            </div>
          ))
        ) : (
          <div className="col-xl-12 text-center">
            <p>해당 카테고리에 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <section className="tp-product-area pt-115 pb-80">
        <div className="container">{content}</div>
      </section>
    </>
  );
};

export default ProductArea;
