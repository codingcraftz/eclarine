import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import { accessory_brands, accessory_products } from "@/data/accessory-data";

const ProductBrand = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // 각 브랜드별 상품 개수 계산 및 정렬
  const brandsWithCount = accessory_brands
    .map((brand) => {
      const productCount = accessory_products.filter(
        (product) => product.brand.name === brand.name
      ).length;
      return {
        ...brand,
        productCount,
      };
    })
    .sort((a, b) => b.productCount - a.productCount); // 상품 개수 많은 순으로 정렬

  // handle brand route
  const handleBrandRoute = (brand) => {
    setCurrPage(1);
    router.push(
      `/${shop_right ? "shop-right-sidebar" : "shop"}?brand=${brand
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    );
    dispatch(handleFilterSidebarClose());
  };

  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title">인기 브랜드</h3>
        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-brand-list d-flex align-items-center justify-content-between flex-wrap">
            {brandsWithCount
              .filter((brand) => brand.is_featured)
              .map((brand) => (
                <div key={brand.id} className="tp-shop-widget-brand-item">
                  <a
                    onClick={() => handleBrandRoute(brand.name)}
                    style={{ cursor: "pointer" }}
                    title={`${brand.name} (${brand.productCount}개 상품)`}
                  >
                    <div className="brand-logo-placeholder">
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          textAlign: "center",
                          display: "block",
                          padding: "10px 5px",
                          border: "1px solid #eee",
                          borderRadius: "4px",
                          minHeight: "50px",
                          lineHeight: "30px",
                        }}
                      >
                        {brand.name}
                      </span>
                    </div>
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductBrand;
