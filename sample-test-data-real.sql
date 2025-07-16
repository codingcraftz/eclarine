-- 🧪 실제 데이터베이스 구조에 맞는 테스트용 샘플 데이터
-- 현재 MongoDB 스타일로 마이그레이션된 데이터베이스 구조에 맞춰 작성

-- 1. 브랜드 데이터 (brands 테이블)
INSERT INTO brands (name, logo, email, website, location, created_at, updated_at) VALUES
('에끌라린', '/images/brands/eclarine.jpg', 'contact@eclarine.com', 'https://eclarine.com', '서울시 강남구', NOW(), NOW()),
('에끌라린 골드', '/images/brands/eclarine-gold.jpg', 'gold@eclarine.com', 'https://gold.eclarine.com', '서울시 강남구', NOW(), NOW()),
('에끌라린 실버', '/images/brands/eclarine-silver.jpg', 'silver@eclarine.com', 'https://silver.eclarine.com', '서울시 강남구', NOW(), NOW());

-- 2. 카테고리 데이터 (categories 테이블)
INSERT INTO categories (parent, img, product_type, status, children, created_at, updated_at) VALUES
('반지', '/images/categories/rings.jpg', 'jewelry', 'Show', '[]'::jsonb, NOW(), NOW()),
('목걸이', '/images/categories/necklaces.jpg', 'jewelry', 'Show', '[]'::jsonb, NOW(), NOW()),
('귀걸이', '/images/categories/earrings.jpg', 'jewelry', 'Show', '[]'::jsonb, NOW(), NOW()),
('팔찌', '/images/categories/bracelets.jpg', 'jewelry', 'Show', '[]'::jsonb, NOW(), NOW()),
('브로치', '/images/categories/brooches.jpg', 'jewelry', 'Show', '[]'::jsonb, NOW(), NOW());

-- 3. 상품 데이터 (products 테이블)
INSERT INTO products (
    sku, img, title, slug, price, discount, quantity, status,
    brand, category, image_urls, product_type, description,
    featured, sell_count, additional_information, tags, sizes,
    created_at, updated_at
) VALUES
(
    'ECL-R-001',
    '/images/products/ring-1.jpg',
    '클래식 다이아몬드 반지',
    'classic-diamond-ring',
    1500000,
    0,
    5,
    'in-stock',
    '{"name": "에끌라린", "logo": "/images/brands/eclarine.jpg"}'::jsonb,
    '{"name": "반지", "img": "/images/categories/rings.jpg"}'::jsonb,
    '["/images/products/ring-1.jpg", "/images/products/ring-1-1.jpg", "/images/products/ring-1-2.jpg"]'::jsonb,
    'jewelry',
    '0.5캐럿 다이아몬드가 세팅된 클래식한 반지입니다. 14K 골드 소재로 제작되어 오랜 시간 착용해도 변색되지 않습니다.',
    true,
    25,
    '[{"key": "소재", "value": "14K 골드"}, {"key": "다이아몬드", "value": "0.5캐럿"}, {"key": "원산지", "value": "대한민국"}]'::jsonb,
    '["반지", "다이아몬드", "골드", "웨딩"]'::jsonb,
    '[{"name": "13호", "value": "13"}, {"name": "15호", "value": "15"}, {"name": "17호", "value": "17"}]'::jsonb,
    NOW(),
    NOW()
),
(
    'ECL-N-001',
    '/images/products/necklace-1.jpg',
    '진주 목걸이',
    'pearl-necklace',
    800000,
    10,
    8,
    'in-stock',
    '{"name": "에끌라린 골드", "logo": "/images/brands/eclarine-gold.jpg"}'::jsonb,
    '{"name": "목걸이", "img": "/images/categories/necklaces.jpg"}'::jsonb,
    '["/images/products/necklace-1.jpg", "/images/products/necklace-1-1.jpg"]'::jsonb,
    'jewelry',
    '고급 진주로 만든 우아한 목걸이입니다. 자연스러운 광택과 완벽한 원형이 특징입니다.',
    true,
    18,
    '[{"key": "소재", "value": "18K 골드"}, {"key": "진주", "value": "담수진주 6-7mm"}, {"key": "길이", "value": "45cm"}]'::jsonb,
    '["목걸이", "진주", "골드", "클래식"]'::jsonb,
    '[{"name": "45cm", "value": "45"}, {"name": "50cm", "value": "50"}]'::jsonb,
    NOW(),
    NOW()
),
(
    'ECL-E-001',
    '/images/products/earrings-1.jpg',
    '골드 귀걸이',
    'gold-earrings',
    350000,
    5,
    12,
    'in-stock',
    '{"name": "에끌라린 골드", "logo": "/images/brands/eclarine-gold.jpg"}'::jsonb,
    '{"name": "귀걸이", "img": "/images/categories/earrings.jpg"}'::jsonb,
    '["/images/products/earrings-1.jpg", "/images/products/earrings-1-1.jpg"]'::jsonb,
    'jewelry',
    '18K 골드로 만든 세련된 귀걸이입니다. 데일리 착용에 적합한 심플한 디자인입니다.',
    false,
    12,
    '[{"key": "소재", "value": "18K 골드"}, {"key": "타입", "value": "스터드형"}, {"key": "크기", "value": "8mm"}]'::jsonb,
    '["귀걸이", "골드", "데일리", "심플"]'::jsonb,
    '[{"name": "원사이즈", "value": "one"}]'::jsonb,
    NOW(),
    NOW()
),
(
    'ECL-B-001',
    '/images/products/bracelet-1.jpg',
    '실버 팔찌',
    'silver-bracelet',
    180000,
    0,
    15,
    'in-stock',
    '{"name": "에끌라린 실버", "logo": "/images/brands/eclarine-silver.jpg"}'::jsonb,
    '{"name": "팔찌", "img": "/images/categories/bracelets.jpg"}'::jsonb,
    '["/images/products/bracelet-1.jpg", "/images/products/bracelet-1-1.jpg"]'::jsonb,
    'jewelry',
    '925 실버로 만든 고급스러운 팔찌입니다. 섬세한 체인 디자인이 돋보입니다.',
    false,
    7,
    '[{"key": "소재", "value": "925 실버"}, {"key": "타입", "value": "체인형"}, {"key": "길이", "value": "18cm"}]'::jsonb,
    '["팔찌", "실버", "체인", "심플"]'::jsonb,
    '[{"name": "18cm", "value": "18"}, {"name": "20cm", "value": "20"}]'::jsonb,
    NOW(),
    NOW()
),
(
    'ECL-BR-001',
    '/images/products/brooch-1.jpg',
    '빈티지 브로치',
    'vintage-brooch',
    120000,
    15,
    20,
    'in-stock',
    '{"name": "에끌라린", "logo": "/images/brands/eclarine.jpg"}'::jsonb,
    '{"name": "브로치", "img": "/images/categories/brooches.jpg"}'::jsonb,
    '["/images/products/brooch-1.jpg", "/images/products/brooch-1-1.jpg"]'::jsonb,
    'jewelry',
    '클래식한 빈티지 스타일의 브로치입니다. 특별한 날 포인트 액세서리로 완벽합니다.',
    false,
    3,
    '[{"key": "소재", "value": "합금"}, {"key": "스타일", "value": "빈티지"}, {"key": "크기", "value": "3cm x 2cm"}]'::jsonb,
    '["브로치", "빈티지", "클래식", "포인트"]'::jsonb,
    '[{"name": "원사이즈", "value": "one"}]'::jsonb,
    NOW(),
    NOW()
);

-- 4. 테스트 사용자 프로필 데이터 (기존 구조 유지)
INSERT INTO user_profiles (id, name, email, phone, role, created_at, updated_at) VALUES
(gen_random_uuid(), '김민지', 'minji@example.com', '010-1234-5678', 'customer', NOW(), NOW()),
(gen_random_uuid(), '박서준', 'seojun@example.com', '010-2345-6789', 'customer', NOW(), NOW()),
(gen_random_uuid(), '이지은', 'jieun@example.com', '010-3456-7890', 'customer', NOW(), NOW());

-- 5. 테스트 주문 데이터 (기존 구조 유지)
INSERT INTO orders (order_number, user_id, name, email, phone, address, payment_method, payment_status, status, subtotal, discount, shipping_cost, tax, total, created_at, updated_at) VALUES
('ECL20241215001', (SELECT id FROM user_profiles WHERE name = '김민지' LIMIT 1), '김민지', 'minji@example.com', '010-1234-5678', '{"address": "서울시 강남구 테헤란로 123", "zipcode": "06142"}', 'card', 'paid', 'delivered', 1500000, 0, 5000, 0, 1505000, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('ECL20241215002', (SELECT id FROM user_profiles WHERE name = '박서준' LIMIT 1), '박서준', 'seojun@example.com', '010-2345-6789', '{"address": "서울시 마포구 홍대입구 456", "zipcode": "04043"}', 'card', 'paid', 'processing', 800000, 80000, 5000, 0, 725000, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('ECL20241215003', (SELECT id FROM user_profiles WHERE name = '이지은' LIMIT 1), '이지은', 'jieun@example.com', '010-3456-7890', '{"address": "부산시 해운대구 센텀 789", "zipcode": "48058"}', 'card', 'paid', 'shipped', 350000, 17500, 5000, 0, 337500, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- 6. 주문 아이템 데이터
INSERT INTO order_items (order_id, product_id, product_title, price, quantity, total, created_at) VALUES
((SELECT _id FROM orders WHERE order_number = 'ECL20241215001' LIMIT 1), (SELECT _id FROM products WHERE title = '클래식 다이아몬드 반지' LIMIT 1), '클래식 다이아몬드 반지', 1500000, 1, 1500000, NOW() - INTERVAL '3 days'),
((SELECT _id FROM orders WHERE order_number = 'ECL20241215002' LIMIT 1), (SELECT _id FROM products WHERE title = '진주 목걸이' LIMIT 1), '진주 목걸이', 800000, 1, 800000, NOW() - INTERVAL '1 day'),
((SELECT _id FROM orders WHERE order_number = 'ECL20241215003' LIMIT 1), (SELECT _id FROM products WHERE title = '골드 귀걸이' LIMIT 1), '골드 귀걸이', 350000, 1, 350000, NOW() - INTERVAL '2 hours');

-- 7. 쿠폰 데이터 (기존 구조 확인 필요)
-- coupons 테이블 구조를 먼저 확인해주세요

-- 확인용 쿼리
SELECT 'products' as table_name, count(*) as count FROM products
UNION ALL
SELECT 'categories' as table_name, count(*) as count FROM categories
UNION ALL
SELECT 'brands' as table_name, count(*) as count FROM brands
UNION ALL
SELECT 'orders' as table_name, count(*) as count FROM orders
UNION ALL
SELECT 'user_profiles' as table_name, count(*) as count FROM user_profiles; 