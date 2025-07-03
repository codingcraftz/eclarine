import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import FooterSimple from "@/layout/footers/footer-simple";
import ContactBreadcrumb from "@/components/breadcrumb/contact-breadcrumb";
import ContactArea from "@/components/contact/contact-area";
import ContactMap from "@/components/contact/contact-map";

const ContactPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Contact" />
      <HeaderTwo style_2={true} />
      <ContactBreadcrumb />
      <ContactArea />
      <ContactMap />
      <FooterSimple />
    </Wrapper>
  );
};

export default ContactPage;
