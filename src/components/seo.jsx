import Head from "next/head";

const SEO = ({ pageTitle }) => (
  <>
    <Head>
      {/* HTML Meta Tags */}
      <title>{pageTitle ? `${pageTitle} - ECLARINE(에끌라린)` : "ECLARINE(에끌라린)"}</title>
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        name="description"
        content="당신의 일상에 특별한 반짝임을 선물해줄 감성 주얼리샵 에끌라린입니다 :)"
      />
      <meta name="robots" content="index, follow" />
      <meta
        name="keywords"
        content="에끌라린, 악세서리전문점, 실버목걸이, 골드반지, 써지컬스틸, 티타늄팔찌, 피어싱, 925실버, 14K골드, 18K골드, 알레르기안전"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content="https://www.eclarine.kr" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content={pageTitle ? `${pageTitle} - ECLARINE(에끌라린)` : "ECLARINE(에끌라린)"}
      />
      <meta
        property="og:description"
        content="당신의 일상에 특별한 반짝임을 선물해줄 감성 주얼리샵 에끌라린입니다 :)"
      />
      <meta
        property="og:image"
        content="https://opengraph.b-cdn.net/production/images/7f6b58f0-42b6-4e99-b428-83028e374975.png?token=j4qUmFRbbfId41PknHGETICtyNp_qHruYT3uFm0OM2s&height=500&width=500&expires=33287513715"
      />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="eclarine.kr" />
      <meta property="twitter:url" content="https://www.eclarine.kr" />
      <meta
        name="twitter:title"
        content={pageTitle ? `${pageTitle} - ECLARINE(에끌라린)` : "ECLARINE(에끌라린)"}
      />
      <meta
        name="twitter:description"
        content="당신의 일상에 특별한 반짝임을 선물해줄 감성 주얼리샵 에끌라린입니다 :)"
      />
      <meta
        name="twitter:image"
        content="https://opengraph.b-cdn.net/production/images/7f6b58f0-42b6-4e99-b428-83028e374975.png?token=j4qUmFRbbfId41PknHGETICtyNp_qHruYT3uFm0OM2s&height=500&width=500&expires=33287513715"
      />

      <link rel="icon" href="/favicon.png" />
    </Head>
  </>
);

export default SEO;
