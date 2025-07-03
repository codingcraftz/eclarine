-- 샘플 데이터 삽입
-- 이 파일을 Supabase SQL 에디터에서 실행하여 테스트 데이터를 추가하세요

-- 1. 카테고리 샘플 데이터
INSERT INTO categories (name, slug, description, image_url) VALUES
('주얼리', 'jewelry', '아름다운 주얼리 컬렉션', '/assets/img/category/category-1.jpg'),
('패션', 'fashion', '트렌디한 패션 아이템', '/assets/img/category/category-2.jpg'),
('전자제품', 'electronics', '최신 전자제품', '/assets/img/category/category-3.jpg'),
('뷰티', 'beauty', '뷰티 & 코스메틱', '/assets/img/category/category-4.jpg');

-- 2. 상품 샘플 데이터
INSERT INTO products (
  title, slug, description, short_description, sku, price, compare_price, 
  discount, type, status, featured_image, category_id, is_featured, is_popular, is_bestseller
) VALUES
-- 주얼리 상품들
('다이아몬드 반지', 'diamond-ring', '아름다운 다이아몬드 반지입니다.', '고급 다이아몬드 반지', 'JW-001', 299000, 350000, 15, 'simple', 'active', '/assets/img/product/product-1.jpg', 1, true, true, false),
('골드 목걸이', 'gold-necklace', '18K 골드 목걸이', '고급스러운 골드 목걸이', 'JW-002', 150000, 180000, 17, 'simple', 'active', '/assets/img/product/product-2.jpg', 1, false, true, true),
('실버 귀걸이', 'silver-earrings', '925 실버 귀걸이', '심플한 실버 귀걸이', 'JW-003', 75000, 90000, 17, 'simple', 'active', '/assets/img/product/product-3.jpg', 1, true, false, false),

-- 패션 상품들
('캐주얼 셔츠', 'casual-shirt', '편안한 캐주얼 셔츠', '데일리 착용하기 좋은 셔츠', 'FA-001', 45000, 55000, 18, 'simple', 'active', '/assets/img/product/product-4.jpg', 2, false, true, false),
('데님 재킷', 'denim-jacket', '트렌디한 데님 재킷', '스타일리시한 데님 재킷', 'FA-002', 89000, 110000, 19, 'simple', 'active', '/assets/img/product/product-5.jpg', 2, true, false, true),
('원피스', 'summer-dress', '여름 원피스', '시원하고 편안한 원피스', 'FA-003', 65000, 80000, 19, 'simple', 'active', '/assets/img/product/product-6.jpg', 2, false, true, false),

-- 전자제품
('스마트폰', 'smartphone', '최신 스마트폰', '고성능 스마트폰', 'EL-001', 899000, 999000, 10, 'simple', 'active', '/assets/img/product/product-7.jpg', 3, true, true, true),
('노트북', 'laptop', '고성능 노트북', '업무용 노트북', 'EL-002', 1200000, 1400000, 14, 'simple', 'active', '/assets/img/product/product-8.jpg', 3, true, false, false),
('이어폰', 'wireless-earphones', '무선 이어폰', '고음질 무선 이어폰', 'EL-003', 120000, 150000, 20, 'simple', 'active', '/assets/img/product/product-9.jpg', 3, false, true, false),

-- 뷰티 상품들
('립스틱', 'luxury-lipstick', '럭셔리 립스틱', '고급 립스틱', 'BE-001', 35000, 45000, 22, 'simple', 'active', '/assets/img/product/product-10.jpg', 4, false, true, false),
('파운데이션', 'foundation', '커버력 좋은 파운데이션', '올데이 파운데이션', 'BE-002', 42000, 55000, 24, 'simple', 'active', '/assets/img/product/product-11.jpg', 4, true, false, true),
('아이섀도우', 'eyeshadow-palette', '아이섀도우 팔레트', '다양한 컬러 팔레트', 'BE-003', 28000, 35000, 20, 'simple', 'active', '/assets/img/product/product-12.jpg', 4, false, true, false);

-- 3. 쿠폰 샘플 데이터
INSERT INTO coupons (code, title, description, discount_type, discount_value, minimum_amount, usage_limit, start_date, end_date) VALUES
('WELCOME10', '신규 가입 10% 할인', '신규 회원 가입시 10% 할인 혜택', 'percentage', 10, 50000, 100, NOW(), NOW() + INTERVAL '30 days'),
('SUMMER20', '여름 특가 20% 할인', '여름 시즌 특별 할인', 'percentage', 20, 100000, 50, NOW(), NOW() + INTERVAL '15 days'),
('FREE_SHIP', '무료 배송', '5만원 이상 구매시 무료 배송', 'free_shipping', 0, 50000, 200, NOW(), NOW() + INTERVAL '60 days'),
('10000OFF', '1만원 즉시 할인', '10만원 이상 구매시 1만원 할인', 'fixed_amount', 10000, 100000, 30, NOW(), NOW() + INTERVAL '45 days');

-- 4. 상품 속성 예시 (JSON 데이터)
UPDATE products SET attributes = '{"colors": ["Red", "Blue", "Black"], "sizes": ["S", "M", "L", "XL"]}' WHERE category_id = 2;
UPDATE products SET attributes = '{"materials": ["Gold", "Silver"], "sizes": ["Small", "Medium", "Large"]}' WHERE category_id = 1;
UPDATE products SET attributes = '{"storage": ["64GB", "128GB", "256GB"], "colors": ["Black", "White", "Blue"]}' WHERE category_id = 3;
UPDATE products SET attributes = '{"shades": ["Light", "Medium", "Dark"], "finish": ["Matte", "Glossy"]}' WHERE category_id = 4;

-- 5. 상품 태그 예시
UPDATE products SET tags = '["trending", "bestseller", "new"]' WHERE is_bestseller = true;
UPDATE products SET tags = '["featured", "premium"]' WHERE is_featured = true;
UPDATE products SET tags = '["popular", "recommended"]' WHERE is_popular = true; 