import React, { useState, useEffect } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";
import ErrorMsg from "@/components/common/error-msg";
import FooterSimple from "@/layout/footers/footer-simple";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import ShopLoader from "@/components/loader/shop/shop-loader";
import { accessory_products } from "@/data/accessory-data";

const ShopPage = ({ query }) => {
  // MOCK 데이터 사용 (외부 API 호출 제거)
  const [products, setProducts] = useState({ data: accessory_products });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);

  // 초기 로딩 시뮬레이션 및 최대 가격 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      const maxPrice = accessory_products.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);
      setIsLoading(false);
    }, 500); // 0.5초 로딩 시뮬레이션

    return () => clearTimeout(timer);
  }, []);

  // handleChanges
  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  // selectHandleFilter
  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  // other props
  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = (
      <div className="pb-80 text-center">
        <ErrorMsg msg="오류가 발생했습니다" />
      </div>
    );
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="상품을 찾을 수 없습니다!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    // products
    let product_items = products.data;

    // 정렬 필터링 (한국어 옵션에 맞게 수정)
    if (selectValue) {
      if (selectValue === "기본 정렬") {
        product_items = products.data;
      } else if (selectValue === "가격 낮은순") {
        product_items = products.data.slice().sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectValue === "가격 높은순") {
        product_items = products.data.slice().sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectValue === "신상품순") {
        product_items = products.data.slice().sort((a, b) => b._id - a._id); // ID 기준 최신순
      } else if (selectValue === "할인상품") {
        product_items = products.data.filter((p) => p.discount > 0);
      } else {
        product_items = products.data;
      }
    }

    // 가격 필터
    product_items = product_items.filter(
      (p) => p.price >= priceValue[0] && p.price <= priceValue[1]
    );

    // 상태 필터
    if (query.status) {
      if (query.status === "on-sale") {
        product_items = product_items.filter((p) => p.discount > 0);
      } else if (query.status === "in-stock") {
        product_items = product_items.filter((p) => p.status === "active");
      }
    }

    // 카테고리 필터 (악세서리 카테고리에 맞게 수정)
    if (query.category) {
      product_items = product_items.filter((p) => p.category.slug === query.category);
    }

    // 제품 타입 필터 (목걸이, 팔찌, 반지 등)
    if (query.type) {
      product_items = product_items.filter((p) => p.type.slug === query.type);
    }

    // 브랜드 필터 (악세서리 브랜드에 맞게 수정)
    if (query.brand) {
      product_items = product_items.filter(
        (p) => p.brand.name.toLowerCase().replace("&", "").split(" ").join("-") === query.brand
      );
    }

    // 태그 필터
    if (query.tag) {
      product_items = product_items.filter((p) =>
        p.tags.some((tag) => tag.toLowerCase().replace("&", "").split(" ").join("-") === query.tag)
      );
    }

    content = (
      <>
        <ShopArea all_products={products.data} products={product_items} otherProps={otherProps} />
        <ShopFilterOffCanvas all_products={products.data} otherProps={otherProps} />
      </>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle="전체상품" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="전체상품" subtitle="에끌라린 악세서리 컬렉션" />
      {content}
      <FooterSimple />
    </Wrapper>
  );
};

export default ShopPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};
