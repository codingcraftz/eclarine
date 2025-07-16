import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import { supabaseService } from "@/lib/supabase";

const CategoryFilter = ({ setCurrPage, shop_right = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catData, prodData] = await Promise.all([
          supabaseService.getCategories(),
          supabaseService.getActiveProducts(),
        ]);
        setCategories(catData || []);
        setProducts(prodData || []);
      } catch (err) {
        setError("카테고리 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 각 카테고리별 상품 개수 계산
  const categoriesWithCount = categories.map((category) => {
    const productCount = products.filter((product) => product.category_id === category.id).length;
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <ErrorMsg msg={error} />;

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
