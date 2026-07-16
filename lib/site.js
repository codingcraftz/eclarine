// 에끌라린 브랜드·사업자 정보 + 홈페이지 진열용 상품(정적).
// 실제 주문은 DB 기반 /shop·/pay 가 담당하고, 이 데이터는 랜딩 진열 전용이다.

export const COMPANY = {
  brand: '에끌라린',
  company: '구름섬컴퍼니',
  ceo: '박준영',
  businessNumber: '632-07-03327',
  ecommerceNumber: '2025-화도수동-0427',
  email: '9851248@gmail.com',
  phone: '010-7977-1248',
  address: '[12175] 경기 남양주시 화도읍 마석중앙로37번길 45 (마석우리, 별나라프라자) 504호',
  kakaoChannel: 'http://pf.kakao.com/_qxcWrn',
  account: { bank: 'KB국민', number: '616337-04-006481', holder: '박준영(구름섬컴퍼니)' },
  freeShippingOver: 50000,
  shippingFee: 3000,
};

// 홈페이지 진열 상품 (실제 촬영본 public/products/*.jpeg)
export const SHOWCASE = [
  { id: 1, name: '올실버 진주토끼 귀걸이', type: '귀걸이', price: 32000, img: '/products/1.jpeg' },
  { id: 3, name: '블링블링 실버 체인 팔찌', type: '팔찌', price: 96000, img: '/products/3.jpeg' },
  { id: 2, name: '올실버 십자가 목걸이', type: '목걸이', price: 34000, img: '/products/2.jpeg' },
  { id: 5, name: '올실버 하트 보석 귀걸이', type: '귀걸이', price: 33000, img: '/products/5.jpeg' },
  { id: 4, name: '데이지 실버 딱붙 귀걸이', type: '귀걸이', price: 18000, img: '/products/4.jpeg' },
];

export const CATEGORIES = ['전체', '귀걸이', '목걸이', '팔찌', '반지', '피어싱'];
