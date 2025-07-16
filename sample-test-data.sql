-- 🧪 테스트용 샘플 데이터
-- 현재 데이터베이스 구조에 맞는 샘플 데이터를 삽입합니다

-- 1. 카테고리 데이터
INSERT INTO categories (name, slug, description, parent_id, image_url, sort_order, is_active, created_at, updated_at) VALUES
('반지', 'rings', '다양한 스타일의 반지 컬렉션', null, '/images/categories/rings.jpg', 1, true, NOW(), NOW()),
('목걸이', 'necklaces', '우아한 목걸이 컬렉션', null, '/images/categories/necklaces.jpg', 2, true, NOW(), NOW()),
('귀걸이', 'earrings', '세련된 귀걸이 컬렉션', null, '/images/categories/earrings.jpg', 3, true, NOW(), NOW());

-- 2. 브랜드 데이터
INSERT INTO brands (name, slug, description, logo_url, is_featured, is_active, created_at, updated_at) VALUES
('에끌라린', 'eclarine', '에끌라린 메인 브랜드', '/images/brands/eclarine.jpg', true, true, NOW(), NOW()),
('에끌라린 골드', 'eclarine-gold', '에끌라린 골드 컬렉션', '/images/brands/eclarine-gold.jpg', true, true, NOW(), NOW());

-- 3. 상품 데이터
INSERT INTO products (title, slug, description, price, discount, image, featured, status, category_id, brand_id, quantity, created_at, updated_at) VALUES
('클래식 다이아몬드 반지', 'classic-diamond-ring', '0.5캐럿 다이아몬드가 세팅된 클래식한 반지입니다.', 1500000, 0, '/images/products/ring-1.jpg', true, 'active', 1, 1, 5, NOW(), NOW()),
('진주 목걸이', 'pearl-necklace', '고급 진주로 만든 우아한 목걸이입니다.', 800000, 10, '/images/products/necklace-1.jpg', true, 'active', 2, 2, 8, NOW(), NOW()),
('골드 귀걸이', 'gold-earrings', '18K 골드로 만든 세련된 귀걸이입니다.', 350000, 5, '/images/products/earrings-1.jpg', false, 'active', 3, 2, 12, NOW(), NOW());

-- 4. 테스트 사용자 프로필 데이터
INSERT INTO user_profiles (id, name, email, phone, role, created_at, updated_at) VALUES
(gen_random_uuid(), '김민지', 'minji@example.com', '010-1234-5678', 'customer', NOW(), NOW()),
(gen_random_uuid(), '박서준', 'seojun@example.com', '010-2345-6789', 'customer', NOW(), NOW()),
(gen_random_uuid(), '이지은', 'jieun@example.com', '010-3456-7890', 'customer', NOW(), NOW());

-- 5. 테스트 주문 데이터
INSERT INTO orders (order_number, user_id, name, email, phone, address, payment_method, payment_status, status, subtotal, discount, shipping_cost, tax, total, created_at, updated_at) VALUES
('ECL20241215001', (SELECT id FROM user_profiles WHERE name = '김민지' LIMIT 1), '김민지', 'minji@example.com', '010-1234-5678', '{"address": "서울시 강남구 테헤란로 123", "zipcode": "06142"}', 'card', 'paid', 'delivered', 1500000, 0, 5000, 0, 1505000, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('ECL20241215002', (SELECT id FROM user_profiles WHERE name = '박서준' LIMIT 1), '박서준', 'seojun@example.com', '010-2345-6789', '{"address": "서울시 마포구 홍대입구 456", "zipcode": "04043"}', 'card', 'paid', 'processing', 800000, 80000, 5000, 0, 725000, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('ECL20241215003', (SELECT id FROM user_profiles WHERE name = '이지은' LIMIT 1), '이지은', 'jieun@example.com', '010-3456-7890', '{"address": "부산시 해운대구 센텀 789", "zipcode": "48058"}', 'card', 'paid', 'shipped', 350000, 17500, 5000, 0, 337500, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- 6. 주문 아이템 데이터
INSERT INTO order_items (order_id, product_id, product_title, price, quantity, total, created_at) VALUES
((SELECT _id FROM orders WHERE order_number = 'ECL20241215001' LIMIT 1), (SELECT _id FROM products WHERE title = '클래식 다이아몬드 반지' LIMIT 1), '클래식 다이아몬드 반지', 1500000, 1, 1500000, NOW() - INTERVAL '3 days'),
((SELECT _id FROM orders WHERE order_number = 'ECL20241215002' LIMIT 1), (SELECT _id FROM products WHERE title = '진주 목걸이' LIMIT 1), '진주 목걸이', 800000, 1, 800000, NOW() - INTERVAL '1 day'),
((SELECT _id FROM orders WHERE order_number = 'ECL20241215003' LIMIT 1), (SELECT _id FROM products WHERE title = '골드 귀걸이' LIMIT 1), '골드 귀걸이', 350000, 1, 350000, NOW() - INTERVAL '2 hours');

-- 7. 쿠폰 데이터
INSERT INTO coupons (code, title, description, discount_type, discount_value, minimum_amount, usage_limit, used_count, start_date, end_date, active, created_at, updated_at) VALUES
('WELCOME20', '신규 고객 20% 할인', '신규 고객 전용 20% 할인 쿠폰', 'percentage', 20, 100000, 1000, 0, NOW(), NOW() + INTERVAL '30 days', true, NOW(), NOW()),
('LUNAR2024', '설날 특가 쿠폰', '설날 기념 특가 쿠폰', 'percentage', 15, 200000, 500, 12, NOW(), NOW() + INTERVAL '15 days', true, NOW(), NOW()),
('VIP10', 'VIP 회원 10% 할인', 'VIP 회원 전용 10% 할인 쿠폰', 'percentage', 10, 50000, 2000, 45, NOW(), NOW() + INTERVAL '60 days', true, NOW(), NOW());

-- 확인용 쿼리
SELECT 'products' as table_name, count(*) as count FROM products
UNION ALL
SELECT 'categories' as table_name, count(*) as count FROM categories
UNION ALL
SELECT 'brands' as table_name, count(*) as count FROM brands
UNION ALL
SELECT 'orders' as table_name, count(*) as count FROM orders
UNION ALL
SELECT 'user_profiles' as table_name, count(*) as count FROM user_profiles
UNION ALL
SELECT 'coupons' as table_name, count(*) as count FROM coupons; 