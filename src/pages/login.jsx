import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import FooterSimple from "@/layout/footers/footer-simple";
import Wrapper from "@/layout/wrapper";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import LoginArea from "@/components/login-register/login-area";

const LoginPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Login" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Login" subtitle="Login" center={true} />
      <LoginArea />
      <FooterSimple />
    </Wrapper>
  );
};

export default LoginPage;
