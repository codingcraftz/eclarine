// 🔮 에끌라린 악세서리 전문 MOCK 데이터
// ======================================================

// 악세서리 카테고리 데이터 (올실버 전문)
export const accessory_categories = [
  {
    id: 1,
    name: "올실버 (All Silver)",
    slug: "silver",
    description: "에끌라린 올실버 악세서리 전체",
    image: "/assets/img/category/silver.jpg",
    icon: "fas fa-star",
    color: "#C0C0C0",
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

// 악세서리 브랜드 (에끌라린으로 통일)
export const accessory_brands = [
  {
    id: 1,
    name: "ECLARINE",
    slug: "eclarine",
    description: "에끌라린 - 감성 주얼리 전문 브랜드",
    logo: "/assets/img/brand/eclarine-logo.png",
    is_featured: true,
  },
];

// 악세서리 상품 데이터 (새로운 에끌라린 상품들)
export const accessory_products = [
  // 1. 올실버 진주토끼 귀걸이
  {
    _id: 1,
    title: "올실버 진주토끼 귀걸이",
    slug: "all-silver-pearl-rabbit-earring",
    img: "/assets/items/1.jpeg",
    price: 32000,
    originalPrice: 32000,
    discount: 0,
    category: { id: 1, name: "올실버", slug: "silver" },
    type: { id: 4, name: "귀걸이", slug: "earring" },
    brand: { id: 1, name: "ECLARINE" },
    description:
      "올실버 소재로 제작된 사랑스러운 진주토끼 귀걸이입니다. 진주의 우아함과 토끼의 귀여움이 만나 특별한 매력을 연출합니다.",
    short_description: "올실버 진주토끼 귀걸이",
    tags: ["all silver", "pearl", "rabbit", "earring", "cute"],
    status: "active",
    quantity: 50,
    is_featured: true,
    is_popular: true,
    is_bestseller: false,
    rating: 4.8,
    reviews: [
      { id: 1, rating: 5, comment: "토끼 디자인이 너무 귀여워요!" },
      { id: 2, rating: 5, comment: "진주가 고급스러워 보입니다" },
      { id: 3, rating: 4, comment: "착용감이 편해요" },
    ],
    imageURLs: [
      { img: "/assets/items/1.jpeg" },
      { img: "/assets/items/1.jpeg" },
      { img: "/assets/items/1.jpeg" },
    ],
    attributes: {
      material: "올실버 (All Silver)",
      size: "12mm",
      weight: "2.5g",
      care: "실버 전용 클리너 사용",
    },
  },

  // 2. 올실버 십자가 목걸이
  {
    _id: 2,
    title: "올실버 십자가 목걸이",
    slug: "all-silver-cross-necklace",
    img: "/assets/items/2.jpeg",
    price: 34000,
    originalPrice: 34000,
    discount: 0,
    category: { id: 1, name: "올실버", slug: "silver" },
    type: { id: 1, name: "목걸이", slug: "necklace" },
    brand: { id: 1, name: "ECLARINE" },
    description:
      "올실버 소재의 클래식한 십자가 목걸이입니다. 심플하면서도 의미 있는 디자인으로 일상에서 특별함을 더해줍니다.",
    short_description: "올실버 십자가 목걸이",
    tags: ["all silver", "cross", "necklace", "classic", "faith"],
    status: "active",
    quantity: 40,
    is_featured: true,
    is_popular: false,
    is_bestseller: true,
    rating: 4.9,
    reviews: [
      { id: 1, rating: 5, comment: "심플하고 고급스러워요" },
      { id: 2, rating: 5, comment: "매일 착용하고 있어요" },
      { id: 3, rating: 5, comment: "선물로 주기에도 좋아요" },
    ],
    imageURLs: [
      { img: "/assets/items/2.jpeg" },
      { img: "/assets/items/2.jpeg" },
      { img: "/assets/items/2.jpeg" },
    ],
    attributes: {
      material: "올실버 (All Silver)",
      length: "45cm (조절 가능)",
      pendant_size: "15mm x 20mm",
      care: "실버 전용 클리너 사용",
    },
  },

  // 3. 블링블링 실버 체인 팔찌
  {
    _id: 3,
    title: "블링블링 실버 체인 팔찌",
    slug: "bling-bling-silver-chain-bracelet",
    img: "/assets/items/3.jpeg",
    price: 96000,
    originalPrice: 96000,
    discount: 0,
    category: { id: 1, name: "올실버", slug: "silver" },
    type: { id: 2, name: "팔찌", slug: "bracelet" },
    brand: { id: 1, name: "ECLARINE" },
    description:
      "올실버 소재에 플래티넘 도금을 입힌 화려한 체인 팔찌입니다. 블링블링한 광채가 손목을 더욱 우아하게 만들어줍니다.",
    short_description: "블링블링 실버 체인 팔찌 (플래티넘 도금)",
    tags: ["all silver", "platinum plating", "chain", "bracelet", "bling"],
    status: "active",
    quantity: 25,
    is_featured: true,
    is_popular: true,
    is_bestseller: false,
    rating: 4.7,
    reviews: [
      { id: 1, rating: 5, comment: "정말 반짝반짝 예뻐요!" },
      { id: 2, rating: 4, comment: "고급스러운 느낌이에요" },
      { id: 3, rating: 5, comment: "플래티넘 도금이 고급스럽습니다" },
    ],
    imageURLs: [
      { img: "/assets/items/3.jpeg" },
      { img: "/assets/items/3.jpeg" },
      { img: "/assets/items/3.jpeg" },
    ],
    attributes: {
      material: "올실버 (All Silver) / 플래티넘 도금",
      length: "17cm (조절 가능)",
      chain_width: "4mm",
      care: "부드러운 천으로 닦기",
    },
  },

  // 4. 데이지 실버 딱붙 귀걸이
  {
    _id: 4,
    title: "데이지 실버 딱붙 귀걸이",
    slug: "daisy-silver-stud-earring",
    img: "/assets/items/4.jpeg",
    price: 18000,
    originalPrice: 18000,
    discount: 0,
    category: { id: 1, name: "올실버", slug: "silver" },
    type: { id: 4, name: "귀걸이", slug: "earring" },
    brand: { id: 1, name: "ECLARINE" },
    description:
      "올실버 소재의 귀여운 데이지 꽃 모양 딱붙 귀걸이입니다. 작고 깔끔한 디자인으로 일상 착용에 완벽합니다.",
    short_description: "데이지 실버 딱붙 귀걸이",
    tags: ["all silver", "daisy", "flower", "stud", "earring"],
    status: "active",
    quantity: 80,
    is_featured: false,
    is_popular: true,
    is_bestseller: true,
    rating: 4.6,
    reviews: [
      { id: 1, rating: 5, comment: "꽃 모양이 너무 예뻐요" },
      { id: 2, rating: 4, comment: "작고 깔끔해서 좋아요" },
      { id: 3, rating: 5, comment: "매일 착용하기 좋습니다" },
    ],
    imageURLs: [
      { img: "/assets/items/4.jpeg" },
      { img: "/assets/items/4.jpeg" },
      { img: "/assets/items/4.jpeg" },
    ],
    attributes: {
      material: "올실버 (All Silver)",
      size: "8mm",
      weight: "1.2g",
      care: "실버 전용 클리너 사용",
    },
  },

  // 5. 올실버 하트 보석 귀걸이
  {
    _id: 5,
    title: "올실버 하트 보석 귀걸이",
    slug: "all-silver-heart-gem-earring",
    img: "/assets/items/5.jpeg",
    price: 33000,
    originalPrice: 33000,
    discount: 0,
    category: { id: 1, name: "올실버", slug: "silver" },
    type: { id: 4, name: "귀걸이", slug: "earring" },
    brand: { id: 1, name: "ECLARINE" },
    description:
      "올실버 소재에 큐빅 보석이 세팅된 하트 모양 귀걸이입니다. 로맨틱한 하트 디자인이 사랑스러운 매력을 연출합니다.",
    short_description: "올실버 하트 보석 귀걸이",
    tags: ["all silver", "heart", "gem", "cubic", "earring"],
    status: "active",
    quantity: 60,
    is_featured: true,
    is_popular: false,
    is_bestseller: false,
    rating: 4.5,
    reviews: [
      { id: 1, rating: 5, comment: "하트 모양이 사랑스러워요" },
      { id: 2, rating: 4, comment: "큐빅이 반짝반짝 예뻐요" },
      { id: 3, rating: 4, comment: "선물로 받고 너무 기뻐요" },
    ],
    imageURLs: [
      { img: "/assets/items/5.jpeg" },
      { img: "/assets/items/5.jpeg" },
      { img: "/assets/items/5.jpeg" },
    ],
    attributes: {
      material: "올실버 (All Silver)",
      size: "10mm x 12mm",
      weight: "2.1g",
      care: "실버 전용 클리너 사용",
    },
  },
];

// 인기 검색어 (에끌라린 상품 기반)
export const popular_searches = [
  "올실버 귀걸이",
  "진주토끼",
  "십자가 목걸이",
  "블링블링 팔찌",
  "데이지 귀걸이",
  "하트 보석",
  "플래티넘 도금",
  "딱붙 귀걸이",
];

// 추천 태그 (에끌라린 컨셉 기반)
export const recommended_tags = [
  { name: "베스트셀러", color: "#FF6B6B" },
  { name: "신상품", color: "#4ECDC4" },
  { name: "올실버", color: "#C0C0C0" },
  { name: "진주토끼", color: "#FFB6C1" },
  { name: "십자가", color: "#DDA0DD" },
  { name: "블링블링", color: "#FFD700" },
  { name: "데이지", color: "#98FB98" },
  { name: "하트보석", color: "#FF69B4" },
];

const accessoryData = {
  accessory_categories,
  product_types,
  accessory_brands,
  accessory_products,
  popular_searches,
  recommended_tags,
};

export default accessoryData;
