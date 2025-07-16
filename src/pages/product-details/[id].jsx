import React, { useEffect, useState } from "react";
// internal
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import FooterSimple from "@/layout/footers/footer-simple";
import Wrapper from "@/layout/wrapper";
import ErrorMsg from "@/components/common/error-msg";
import { supabaseService } from "@/lib/supabase";
import ProductDetailsBreadcrumb from "@/components/breadcrumb/product-details-breadcrumb";
import ProductDetailsArea from "@/components/product-details/product-details-area";

const ProductDetailsPage = ({ query }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await supabaseService.getProductById(query.id);
        setProduct({
          ...data,
          category: data.category || data.categories || {},
        });
      } catch (err) {
        setError("존재하지 않는 상품입니다. (id: " + query.id + ")");
      } finally {
        setLoading(false);
      }
    };
    if (query.id) fetchProduct();
  }, [query.id]);

  let content = null;
  if (loading) {
    content = <div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div>;
  } else if (error) {
    content = <ErrorMsg msg={error} />;
  } else if (product) {
    content = (
      <>
        <ProductDetailsBreadcrumb category={product.category?.name} title={product.title} />
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
