import React, { useEffect, useRef, useState } from "react";
import ProductItem from "./product-item";
import { accessory_products } from "@/data/accessory-data";

// tabs (한글로 변경)
const tabs = ["전체 상품", "팔찌", "목걸이", "귀걸이"];

const ProductArea = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const activeRef = useRef(null);
  const marker = useRef(null);

  // handleActiveTab
  useEffect(() => {
    // Position the marker after the active tab has been updated
    if (activeRef.current && marker.current) {
      marker.current.style.left = activeRef.current.offsetLeft + "px";
      marker.current.style.width = activeRef.current.offsetWidth + "px";
    }
  }, [activeTab]);

  const handleActiveTab = (e, tab) => {
    setActiveTab(tab);
  };

  // MOCK 데이터에서 카테고리별로 필터링
  let product_items = accessory_products;

  if (activeTab === "전체 상품") {
    product_items = accessory_products;
  } else if (activeTab === "팔찌") {
    product_items = accessory_products.filter((p) => p.type.slug === "bracelet");
  } else if (activeTab === "목걸이") {
    product_items = accessory_products.filter((p) => p.type.slug === "necklace");
  } else if (activeTab === "귀걸이") {
    product_items = accessory_products.filter((p) => p.type.slug === "earring");
  } else {
    product_items = accessory_products;
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
                      <span className="tp-product-tab-tooltip">{product_items.length}</span>
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
        {product_items.map((prd) => (
          <div key={prd._id} className="col-xl-3 col-lg-4 col-sm-6">
            <ProductItem product={prd} />
          </div>
        ))}
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
