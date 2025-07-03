import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import { accessory_categories, accessory_products } from "@/data/accessory-data";

const CategoryFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // 각 카테고리별 상품 개수 계산
  const categoriesWithCount = accessory_categories.map((category) => {
    const productCount = accessory_products.filter(
      (product) => product.category.slug === category.slug
    ).length;
    return {
      ...category,
      productCount,
    };
  });

  // handle category route
  const handleCategoryRoute = (slug) => {
    setCurrPage(1);
    router.push(`/${shop_right ? "shop-right-sidebar" : "shop"}?category=${slug}`);
    dispatch(handleFilterSidebarClose());
  };

  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title">카테고리</h3>
        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-categories">
            <ul>
              {categoriesWithCount.map((category) => (
                <li key={category.id}>
                  <a
                    onClick={() => handleCategoryRoute(category.slug)}
                    style={{ cursor: "pointer" }}
                    className={router.query.category === category.slug ? "active" : ""}
                  >
                    {category.name} <span>{category.productCount}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
