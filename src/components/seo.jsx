import Head from "next/head";

const SEO = ({ pageTitle }) => (
  <>
    <Head>
      <title>{pageTitle ? `${pageTitle} - 에끌라린` : "에끌라린 - 프리미엄 온라인 쇼핑몰"}</title>
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="description"
        content="에끌라린은 925 실버, 14K/18K 골드, 써지컬 스틸, 티타늄 등 고품질 소재의 프리미엄 악세서리를 제공하는 전문 쇼핑몰입니다. 목걸이, 팔찌, 반지, 귀걸이, 피어싱 등 다양한 악세서리를 만나보세요."
      />
      <meta name="robots" content="index, follow" />
      <meta
        name="keywords"
        content="에끌라린, 악세서리전문점, 실버목걸이, 골드반지, 써지컬스틸, 티타늄팔찌, 피어싱, 925실버, 14K골드, 18K골드, 알레르기안전"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta
        property="og:title"
        content={pageTitle ? `${pageTitle} - 에끌라린` : "에끌라린 - 프리미엄 온라인 쇼핑몰"}
      />
      <meta
        property="og:description"
        content="에끌라린은 925 실버, 14K/18K 골드, 써지컬 스틸, 티타늄 등 고품질 소재의 프리미엄 악세서리를 제공하는 전문 쇼핑몰입니다. (구름섬컴퍼니 운영)"
      />
      <meta property="og:type" content="website" />
      <link rel="icon" href="/favicon.png" />
    </Head>
  </>
);

export default SEO;
