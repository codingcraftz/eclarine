// 🔮 에끌라린 악세서리 전문 MOCK 데이터
// ======================================================

// 악세서리 카테고리 데이터
export const accessory_categories = [
  {
    id: 1,
    name: "실버 (Silver)",
    slug: "silver",
    description: "925 실버 소재의 고급 악세서리",
    image: "/assets/img/category/silver.jpg",
    icon: "fas fa-star",
    color: "#C0C0C0",
    is_featured: true,
  },
  {
    id: 2,
    name: "써지컬 스틸 (Surgical)",
    slug: "surgical",
    description: "알레르기 안전한 써지컬 스틸 소재",
    image: "/assets/img/category/surgical.jpg",
    icon: "fas fa-shield-alt",
    color: "#708090",
    is_featured: true,
  },
  {
    id: 3,
    name: "골드 (Gold)",
    slug: "gold",
    description: "14K/18K 골드 프리미엄 악세서리",
    image: "/assets/img/category/gold.jpg",
    icon: "fas fa-crown",
    color: "#FFD700",
    is_featured: true,
  },
  {
    id: 4,
    name: "티타늄 (Titanium)",
    slug: "titanium",
    description: "가벼우면서 강한 티타늄 소재",
    image: "/assets/img/category/titanium.jpg",
    icon: "fas fa-atom",
    color: "#434343",
    is_featured: false,
  },
  {
    id: 5,
    name: "피어싱 (Piercing)",
    slug: "piercing",
    description: "다양한 피어싱 전용 악세서리",
    image: "/assets/img/category/piercing.jpg",
    icon: "fas fa-circle",
    color: "#FF6B6B",
    is_featured: true,
  },
];

// 제품 타입
export const product_types = [
  { id: 1, name: "목걸이", slug: "necklace", icon: "fas fa-gem" },
  { id: 2, name: "팔찌", slug: "bracelet", icon: "fas fa-circle-notch" },
  { id: 3, name: "반지", slug: "ring", icon: "fas fa-ring" },
  { id: 4, name: "귀걸이", slug: "earring", icon: "fas fa-moon" },
  { id: 5, name: "피어싱", slug: "piercing", icon: "fas fa-dot-circle" },
];

// 악세서리 브랜드
export const accessory_brands = [
  {
    id: 1,
    name: "ECLARINE",
    slug: "eclarine",
    description: "에끌라린 자체 브랜드",
    logo: "/assets/img/brand/eclarine-logo.png",
    is_featured: true,
  },
  {
    id: 2,
    name: "Silver Moon",
    slug: "silver-moon",
    description: "프리미엄 실버 전문 브랜드",
    logo: "/assets/img/brand/silver-moon-logo.png",
    is_featured: true,
  },
  {
    id: 3,
    name: "Steel & Style",
    slug: "steel-style",
    description: "써지컬 스틸 전문 브랜드",
    logo: "/assets/img/brand/steel-style-logo.png",
    is_featured: false,
  },
  {
    id: 4,
    name: "Golden Craft",
    slug: "golden-craft",
    description: "수제 골드 악세서리 브랜드",
    logo: "/assets/img/brand/golden-craft-logo.png",
    is_featured: true,
  },
  {
    id: 5,
    name: "Piercing Pro",
    slug: "piercing-pro",
    description: "피어싱 전문 브랜드",
    logo: "/assets/img/brand/piercing-pro-logo.png",
    is_featured: false,
  },
];

// 악세서리 상품 데이터
export const accessory_products = [
  // 실버 목걸이
  {
    _id: 1,
    title: "925 실버 체인 목걸이",
    slug: "925-silver-chain-necklace",
    img: "/assets/img/product/jewelry/product-1.jpg",
    price: 89000,
    originalPrice: 129000,
    discount: 31,
    category: { id: 1, name: "실버", slug: "silver" },
    type: { id: 1, name: "목걸이", slug: "necklace" },
    brand: { id: 2, name: "Silver Moon" },
    description:
      "925 실버로 제작된 클래식한 체인 목걸이입니다. 깔끔한 디자인으로 어떤 스타일에도 잘 어울립니다.",
    short_description: "925 실버 클래식 체인 목걸이",
    tags: ["silver", "necklace", "chain", "classic"],
    status: "active",
    quantity: 50,
    is_featured: true,
    is_popular: true,
    is_bestseller: false,
    rating: 4.8,
    reviews: [
      { id: 1, rating: 5, comment: "품질이 정말 좋아요!" },
      { id: 2, rating: 4, comment: "디자인이 세련되네요" },
    ],
    imageURLs: [
      "/assets/img/product/jewelry/product-1.jpg",
      "/assets/img/product/jewelry/product-1-2.jpg",
    ],
    attributes: {
      material: "925 실버",
      length: "40cm",
      weight: "8g",
      care: "물기 제거 후 보관",
    },
  },

  // 써지컬 스틸 귀걸이
  {
    _id: 2,
    title: "써지컬 스틸 원터치 귀걸이",
    slug: "surgical-steel-onetouch-earring",
    img: "/assets/img/product/jewelry/product-2.jpg",
    price: 25000,
    originalPrice: 35000,
    discount: 29,
    category: { id: 2, name: "써지컬 스틸", slug: "surgical" },
    type: { id: 4, name: "귀걸이", slug: "earring" },
    brand: { id: 3, name: "Steel & Style" },
    description:
      "알레르기 반응이 없는 써지컬 스틸 소재의 원터치 귀걸이입니다. 착용이 간편하고 편안합니다.",
    short_description: "알레르기 안전 써지컬 스틸 원터치 귀걸이",
    tags: ["surgical steel", "earring", "hypoallergenic", "onetouch"],
    status: "active",
    quantity: 100,
    is_featured: false,
    is_popular: true,
    is_bestseller: true,
    rating: 4.9,
    reviews: [
      { id: 1, rating: 5, comment: "알레르기 없고 착용감 최고!" },
      { id: 2, rating: 5, comment: "원터치라 편해요" },
      { id: 3, rating: 4, comment: "디자인 심플하고 좋음" },
    ],
    imageURLs: ["/assets/img/product/jewelry/product-2.jpg"],
    attributes: {
      material: "316L 써지컬 스틸",
      diameter: "12mm",
      thickness: "1.2mm",
      care: "물세척 가능",
    },
  },

  // 골드 반지
  {
    _id: 3,
    title: "14K 골드 시그니처 반지",
    slug: "14k-gold-signature-ring",
    img: "/assets/img/product/jewelry/product-3.jpg",
    price: 450000,
    originalPrice: 450000,
    discount: 0,
    category: { id: 3, name: "골드", slug: "gold" },
    type: { id: 3, name: "반지", slug: "ring" },
    brand: { id: 4, name: "Golden Craft" },
    description:
      "14K 골드로 제작된 프리미엄 시그니처 반지입니다. 세련된 디자인과 완벽한 마감이 특징입니다.",
    short_description: "14K 골드 프리미엄 시그니처 반지",
    tags: ["14k gold", "ring", "signature", "premium"],
    status: "active",
    quantity: 15,
    is_featured: true,
    is_popular: false,
    is_bestseller: false,
    rating: 4.7,
    reviews: [
      { id: 1, rating: 5, comment: "정말 고급스러워요!" },
      { id: 2, rating: 4, comment: "마감이 깔끔합니다" },
    ],
    imageURLs: ["/assets/img/product/jewelry/product-3.jpg"],
    attributes: {
      material: "14K 골드",
      sizes: "12호, 13호, 14호, 15호, 16호",
      weight: "4.2g",
      care: "전용 클리너 사용",
    },
  },

  // 티타늄 팔찌
  {
    _id: 4,
    title: "티타늄 미니멀 팔찌",
    slug: "titanium-minimal-bracelet",
    img: "/assets/img/product/jewelry/product-4.jpg",
    price: 120000,
    originalPrice: 150000,
    discount: 20,
    category: { id: 4, name: "티타늄", slug: "titanium" },
    type: { id: 2, name: "팔찌", slug: "bracelet" },
    brand: { id: 1, name: "ECLARINE" },
    description:
      "가볍고 강한 티타늄 소재의 미니멀 디자인 팔찌입니다. 스포츠와 일상 모두에 적합합니다.",
    short_description: "가벼운 티타늄 미니멀 팔찌",
    tags: ["titanium", "bracelet", "minimal", "sport"],
    status: "active",
    quantity: 30,
    is_featured: false,
    is_popular: true,
    is_bestseller: false,
    rating: 4.6,
    reviews: [
      { id: 1, rating: 5, comment: "가벼워서 착용감이 좋아요" },
      { id: 2, rating: 4, comment: "디자인이 깔끔해요" },
    ],
    imageURLs: ["/assets/img/product/jewelry/product-4.jpg"],
    attributes: {
      material: "Grade 2 티타늄",
      length: "18cm (조절 가능)",
      weight: "12g",
      care: "물세척 가능",
    },
  },

  // 피어싱
  {
    _id: 5,
    title: "써지컬 스틸 코 피어싱",
    slug: "surgical-steel-nose-piercing",
    img: "/assets/img/product/jewelry/product-5.jpg",
    price: 15000,
    originalPrice: 20000,
    discount: 25,
    category: { id: 2, name: "써지컬 스틸", slug: "surgical" },
    type: { id: 5, name: "피어싱", slug: "piercing" },
    brand: { id: 5, name: "Piercing Pro" },
    description:
      "316L 써지컬 스틸로 제작된 코 피어싱입니다. 알레르기 반응 없이 안전하게 착용 가능합니다.",
    short_description: "316L 써지컬 스틸 코 피어싱",
    tags: ["surgical steel", "nose piercing", "316L", "hypoallergenic"],
    status: "active",
    quantity: 200,
    is_featured: false,
    is_popular: false,
    is_bestseller: true,
    rating: 4.9,
    reviews: [
      { id: 1, rating: 5, comment: "알레르기 없고 착용감 좋음" },
      { id: 2, rating: 5, comment: "품질 만족합니다" },
      { id: 3, rating: 5, comment: "가격대비 훌륭해요" },
    ],
    imageURLs: ["/assets/img/product/jewelry/product-5.jpg"],
    attributes: {
      material: "316L 써지컬 스틸",
      gauge: "20G (0.8mm)",
      length: "6mm",
      care: "소독용 알코올로 청소",
    },
  },

  // 실버 팔찌
  {
    _id: 6,
    title: "925 실버 볼 체인 팔찌",
    slug: "925-silver-ball-chain-bracelet",
    img: "/assets/img/product/jewelry/product-6.jpg",
    price: 65000,
    originalPrice: 85000,
    discount: 24,
    category: { id: 1, name: "실버", slug: "silver" },
    type: { id: 2, name: "팔찌", slug: "bracelet" },
    brand: { id: 2, name: "Silver Moon" },
    description:
      "925 실버 볼 체인으로 제작된 세련된 팔찌입니다. 유니크한 볼 디자인이 포인트입니다.",
    short_description: "925 실버 볼 체인 팔찌",
    tags: ["silver", "bracelet", "ball chain", "unique"],
    status: "active",
    quantity: 40,
    is_featured: true,
    is_popular: false,
    is_bestseller: false,
    rating: 4.5,
    reviews: [
      { id: 1, rating: 4, comment: "디자인이 독특하고 예뻐요" },
      { id: 2, rating: 5, comment: "실버 광택이 좋습니다" },
    ],
    imageURLs: ["/assets/img/product/jewelry/product-6.jpg"],
    attributes: {
      material: "925 실버",
      length: "17cm (조절 가능)",
      ball_size: "3mm",
      care: "실버 전용 클리너 사용",
    },
  },

  // 골드 귀걸이
  {
    _id: 7,
    title: "18K 골드 드롭 귀걸이",
    slug: "18k-gold-drop-earring",
    img: "/assets/img/product/jewelry/product-7.jpg",
    price: 680000,
    originalPrice: 680000,
    discount: 0,
    category: { id: 3, name: "골드", slug: "gold" },
    type: { id: 4, name: "귀걸이", slug: "earring" },
    brand: { id: 4, name: "Golden Craft" },
    description:
      "18K 골드로 제작된 우아한 드롭 귀걸이입니다. 특별한 날을 위한 럭셔리 악세서리입니다.",
    short_description: "18K 골드 럭셔리 드롭 귀걸이",
    tags: ["18k gold", "earring", "drop", "luxury"],
    status: "active",
    quantity: 8,
    is_featured: true,
    is_popular: true,
    is_bestseller: false,
    rating: 4.8,
    reviews: [
      { id: 1, rating: 5, comment: "정말 아름다워요!" },
      { id: 2, rating: 5, comment: "특별한 날에 착용하기 좋아요" },
    ],
    imageURLs: ["/assets/img/product/jewelry/product-7.jpg"],
    attributes: {
      material: "18K 골드",
      length: "25mm",
      weight: "3.8g",
      care: "골드 전용 클리너 사용",
    },
  },

  // 티타늄 귀걸이
  {
    _id: 8,
    title: "티타늄 스터드 귀걸이",
    slug: "titanium-stud-earring",
    img: "/assets/img/product/jewelry/product-8.jpg",
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    category: { id: 4, name: "티타늄", slug: "titanium" },
    type: { id: 4, name: "귀걸이", slug: "earring" },
    brand: { id: 1, name: "ECLARINE" },
    description:
      "가벼운 티타늄 소재의 스터드 귀걸이입니다. 민감한 피부에도 안전하게 착용 가능합니다.",
    short_description: "가벼운 티타늄 스터드 귀걸이",
    tags: ["titanium", "earring", "stud", "lightweight"],
    status: "active",
    quantity: 60,
    is_featured: false,
    is_popular: true,
    is_bestseller: true,
    rating: 4.7,
    reviews: [
      { id: 1, rating: 5, comment: "가벼워서 편해요" },
      { id: 2, rating: 4, comment: "알레르기 없어서 좋습니다" },
    ],
    imageURLs: ["/assets/img/product/jewelry/product-8.jpg"],
    attributes: {
      material: "Grade 1 티타늄",
      size: "6mm",
      weight: "0.8g",
      care: "물세척 가능",
    },
  },
];

// 인기 검색어
export const popular_searches = [
  "실버 목걸이",
  "써지컬 스틸",
  "골드 반지",
  "피어싱",
  "티타늄 팔찌",
  "925 실버",
  "원터치 귀걸이",
  "미니멀 악세서리",
];

// 추천 태그
export const recommended_tags = [
  { name: "베스트셀러", color: "#FF6B6B" },
  { name: "신상품", color: "#4ECDC4" },
  { name: "알레르기 안전", color: "#45B7D1" },
  { name: "925 실버", color: "#96CEB4" },
  { name: "써지컬 스틸", color: "#FECA57" },
  { name: "14K 골드", color: "#FFD700" },
  { name: "피어싱", color: "#FF9FF3" },
  { name: "미니멀", color: "#54A0FF" },
];

export default {
  accessory_categories,
  product_types,
  accessory_brands,
  accessory_products,
  popular_searches,
  recommended_tags,
};
