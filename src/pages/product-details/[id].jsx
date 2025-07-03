import React from "react";
// internal
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import FooterSimple from "@/layout/footers/footer-simple";
import Wrapper from "@/layout/wrapper";
import ErrorMsg from "@/components/common/error-msg";
import { accessory_products } from "@/data/accessory-data";
import ProductDetailsBreadcrumb from "@/components/breadcrumb/product-details-breadcrumb";
import ProductDetailsArea from "@/components/product-details/product-details-area";

const ProductDetailsPage = ({ query }) => {
  // MOCK 데이터에서 상품 찾기
  const product = accessory_products.find((p) => p._id.toString() === query.id);

  // decide what to render
  let content = null;

  if (!product) {
    content = <ErrorMsg msg="상품을 찾을 수 없습니다" />;
  } else {
    content = (
      <>
        <ProductDetailsBreadcrumb category={product.category.name} title={product.title} />
        <ProductDetailsArea productItem={product} />
      </>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle="Product Details" />
      <HeaderTwo style_2={true} />
      {content}
      <FooterSimple />
    </Wrapper>
  );
};

export default ProductDetailsPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};
