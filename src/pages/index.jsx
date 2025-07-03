import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderFour from "@/layout/headers/header-4";
import JewelryBanner from "@/components/banner/jewelry-banner";
import JewelryShopBanner from "@/components/shop-banner/jewelry-shop-banner";
import JewelryAbout from "@/components/about/jewelry-about";
import PopularProducts from "@/components/products/jewelry/popular-products";
import ProductArea from "@/components/products/jewelry/product-area";
import BestSellerPrd from "@/components/products/jewelry/best-seller-prd";
import InstagramAreaFour from "@/components/instagram/instagram-area-4";
import FeatureAreaThree from "@/components/features/feature-area-3";
import FooterSimple from "@/layout/footers/footer-simple";

export default function Home() {
  return (
    <Wrapper>
      <SEO pageTitle="Home" />
      <HeaderFour />
      <JewelryBanner />
      <FeatureAreaThree />
      <JewelryShopBanner />
      <JewelryAbout />
      <PopularProducts />
      <ProductArea />
      <BestSellerPrd />
      <InstagramAreaFour />
      <FooterSimple />
    </Wrapper>
  );
}
