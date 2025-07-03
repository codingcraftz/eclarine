// 🏢 구름섬컴퍼니 - 에끌라린 회사 정보
// ===============================================

export const companyInfo = {
  // 기본 회사 정보
  companyName: "구름섬컴퍼니",
  brandName: "에끌라린",
  representativeName: "박준영",

  // 사업자 정보
  businessNumber: "632-07-03327",
  ecommerceNumber: "2025-화도수동-0427",

  // 연락처 정보
  email: "9851248@gmail.com",
  phone: "02-1234-5678",
  customerServiceHours: "평일 09:00 - 18:00 (점심시간 12:00 - 13:00)",

  // 주소 정보
  address: {
    zipCode: "12175",
    fullAddress: "[12175] 경기 남양주시 화도읍 마석중앙로37번길 45 (마석우리, 별나라프라자) 504호",
    province: "경기",
    city: "남양주시",
    district: "화도읍",
    street: "마석중앙로37번길 45",
    building: "별나라프라자",
    unit: "504호",
    mapLink: "https://maps.google.com",
  },

  // 회사 설명
  description: {
    short:
      "에끌라린은 고품질의 실버, 골드, 써지컬 스틸 등 다양한 소재의 프리미엄 악세서리를 제공하는 전문 쇼핑몰입니다.",
    full: "에끌라린은 고품질의 실버, 골드, 써지컬 스틸 등 다양한 소재의 프리미엄 악세서리를 제공하는 전문 쇼핑몰입니다. 구름섬컴퍼니가 운영하며, 알레르기 안전 소재와 우수한 품질의 악세서리로 고객 만족을 추구합니다.",
  },

  // 소셜 미디어 (추후 업데이트)
  socialMedia: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    youtube: "#",
    kakaoTalk: "#",
  },

  // 정책 및 약관 링크
  policies: {
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
    refund: "/refund-policy",
    shipping: "/shipping-policy",
  },

  // 운영 정보
  operation: {
    established: "2024",
    businessType: "온라인 악세서리 전문몰",
    mainProducts: [
      "실버 악세서리",
      "골드 악세서리",
      "써지컬 스틸 악세서리",
      "티타늄 악세서리",
      "피어싱",
    ],
    specialties: ["925 실버", "14K/18K 골드", "316L 써지컬 스틸", "알레르기 안전 소재"],
  },

  // 배송 정보
  shipping: {
    freeShippingLimit: 50000, // 5만원 이상 무료배송
    standardShippingFee: 3000,
    regions: {
      domestic: "전국 배송",
      jeju: "제주도 추가 배송비 3,000원",
      international: "해외배송 문의",
    },
  },

  // 결제 정보
  payment: {
    methods: [
      "신용카드",
      "체크카드",
      "계좌이체",
      "무통장입금",
      "간편결제 (카카오페이, 네이버페이, 페이코)",
      "휴대폰 결제",
    ],
    installment: "2-12개월 무이자 할부 (카드사별 상이)",
  },
};

// 회사 정보 포맷팅 유틸리티 함수들
export const formatters = {
  // 사업자번호 포맷 (123-45-67890)
  formatBusinessNumber: (number = companyInfo.businessNumber) => {
    return number.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
  },

  // 전화번호 포맷
  formatPhone: (phone = companyInfo.phone) => {
    return phone.replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  },

  // 전체 회사명 (브랜드명 + 회사명)
  getFullCompanyName: () => {
    return `${companyInfo.brandName} (${companyInfo.companyName})`;
  },

  // 푸터용 카피라이트 텍스트
  getCopyright: () => {
    const currentYear = new Date().getFullYear();
    return `© ${currentYear} ${formatters.getFullCompanyName()}. All Rights Reserved | 대표자: ${
      companyInfo.representativeName
    } | 사업자번호: ${formatters.formatBusinessNumber()} | 통신판매업: ${
      companyInfo.ecommerceNumber
    }`;
  },

  // 메타 태그용 설명
  getMetaDescription: () => {
    return `${companyInfo.description.short} (${companyInfo.companyName} 운영)`;
  },
};

export default companyInfo;
