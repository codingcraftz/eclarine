-- 📊 새 스키마에 맞는 샘플 데이터 삽입
-- reset-and-create-clean-database.sql 실행 후 이 파일을 실행하세요

-- ========================================
-- 1. 브랜드 데이터
-- ========================================
INSERT INTO brands (name, slug, description, logo_url, website_url, is_active) VALUES
('에끌라린', 'eclarine', '프리미엄 한국 주얼리 브랜드', '/images/brands/eclarine.jpg', 'https://eclarine.com', true),
('에끌라린 골드', 'eclarine-gold', '에끌라린 골드 컬렉션', '/images/brands/eclarine-gold.jpg', 'https://gold.eclarine.com', true),
('에끌라린 실버', 'eclarine-silver', '에끌라린 실버 컬렉션', '/images/brands/eclarine-silver.jpg', 'https://silver.eclarine.com', true),
('에끌라린 다이아', 'eclarine-diamond', '에끌라린 다이아몬드 컬렉션', '/images/brands/eclarine-diamond.jpg', 'https://diamond.eclarine.com', true);

-- ========================================
-- 2. 카테고리 데이터
-- ========================================
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active) VALUES
('반지', 'rings', '다양한 스타일의 반지 컬렉션', '/images/categories/rings.jpg', 1, true),
('목걸이', 'necklaces', '우아한 목걸이 컬렉션', '/images/categories/necklaces.jpg', 2, true),
('귀걸이', 'earrings', '세련된 귀걸이 컬렉션', '/images/categories/earrings.jpg', 3, true),
('팔찌', 'bracelets', '고급스러운 팔찌 컬렉션', '/images/categories/bracelets.jpg', 4, true),
('브로치', 'brooches', '클래식한 브로치 컬렉션', '/images/categories/brooches.jpg', 5, true);

-- ========================================
-- 3. 상품 데이터 (홈페이지 + 관리자 페이지 공용)
-- ========================================
INSERT INTO products (
    title, slug, description, short_description, sku, 
    price, compare_price, quantity, status, 
    featured_image, gallery_images,
    is_featured, is_popular,
    category_id, brand_id,
    average_rating, review_count, sales_count, view_count
) VALUES
(
    '클래식 다이아몬드 반지',
    'classic-diamond-ring',
    '0.5캐럿 다이아몬드가 세팅된 클래식한 반지입니다. 14K 골드 소재로 제작되어 오랜 시간 착용해도 변색되지 않습니다. 결혼식이나 약혼식 등 특별한 순간을 위한 완벽한 선택입니다.',
    '0.5캐럿 다이아몬드 반지',
    'ECL-R-001',
    1500000.00,
    1800000.00,
    5,
    'active',
    '/images/products/ring-1.jpg',
    '["/images/products/ring-1.jpg", "/images/products/ring-1-1.jpg", "/images/products/ring-1-2.jpg"]'::jsonb,
    true,
    true,
    1, -- 반지 카테고리
    1, -- 에끌라린 브랜드
    4.8,
    25,
    15,
    342
),
(
    '진주 목걸이',
    'pearl-necklace',
    '고급 진주로 만든 우아한 목걸이입니다. 자연스러운 광택과 완벽한 원형이 특징입니다. 클래식한 디자인으로 어떤 의상과도 잘 어울리는 타임리스한 아이템입니다.',
    '고급 진주 목걸이',
    'ECL-N-001',
    800000.00,
    1000000.00,
    8,
    'active',
    '/images/products/necklace-1.jpg',
    '["/images/products/necklace-1.jpg", "/images/products/necklace-1-1.jpg", "/images/products/necklace-1-2.jpg"]'::jsonb,
    true,
    true,
    2, -- 목걸이 카테고리
    2, -- 에끌라린 골드 브랜드
    4.6,
    18,
    22,
    198
),
(
    '골드 귀걸이',
    'gold-earrings',
    '18K 골드로 만든 세련된 귀걸이입니다. 데일리 착용에 적합한 심플한 디자인으로 오피스룩부터 캐주얼까지 다양한 스타일에 매치할 수 있습니다.',
    '18K 골드 귀걸이',
    'ECL-E-001',
    350000.00,
    400000.00,
    12,
    'active',
    '/images/products/earrings-1.jpg',
    '["/images/products/earrings-1.jpg", "/images/products/earrings-1-1.jpg"]'::jsonb,
    false,
    true,
    3, -- 귀걸이 카테고리
    2, -- 에끌라린 골드 브랜드
    4.4,
    12,
    8,
    156
),
(
    '실버 팔찌',
    'silver-bracelet',
    '925 실버로 만든 고급스러운 팔찌입니다. 섬세한 체인 디자인이 돋보이며, 단독 착용 또는 다른 팔찌와 레이어링하여 착용할 수 있습니다.',
    '925 실버 팔찌',
    'ECL-B-001',
    180000.00,
    220000.00,
    15,
    'active',
    '/images/products/bracelet-1.jpg',
    '["/images/products/bracelet-1.jpg", "/images/products/bracelet-1-1.jpg"]'::jsonb,
    false,
    false,
    4, -- 팔찌 카테고리
    3, -- 에끌라린 실버 브랜드
    4.2,
    7,
    12,
    89
),
(
    '빈티지 브로치',
    'vintage-brooch',
    '클래식한 빈티지 스타일의 브로치입니다. 특별한 날 포인트 액세서리로 완벽하며, 자켓이나 드레스에 포인트를 주어 세련된 룩을 연출할 수 있습니다.',
    '빈티지 스타일 브로치',
    'ECL-BR-001',
    120000.00,
    150000.00,
    20,
    'active',
    '/images/products/brooch-1.jpg',
    '["/images/products/brooch-1.jpg", "/images/products/brooch-1-1.jpg"]'::jsonb,
    false,
    false,
    5, -- 브로치 카테고리
    1, -- 에끌라린 브랜드
    4.0,
    3,
    5,
    67
),
(
    '트렌디 심플 반지',
    'trendy-simple-ring',
    '모던하고 심플한 디자인의 반지입니다. 일상 착용에 부담스럽지 않은 세련된 디자인으로 다양한 연령층에게 인기가 많습니다.',
    '모던 심플 반지',
    'ECL-R-002',
    250000.00,
    null,
    25,
    'active',
    '/images/products/ring-2.jpg',
    '["/images/products/ring-2.jpg"]'::jsonb,
    true,
    false,
    1, -- 반지 카테고리
    3, -- 에끌라린 실버 브랜드
    4.3,
    9,
    18,
    134
),
(
    '골드 체인 목걸이',
    'gold-chain-necklace',
    '14K 골드 체인 목걸이로 심플하면서도 고급스러운 느낌을 줍니다. 펜던트 없이도 충분히 세련된 룩을 완성할 수 있습니다.',
    '14K 골드 체인 목걸이',
    'ECL-N-002',
    420000.00,
    480000.00,
    10,
    'active',
    '/images/products/necklace-2.jpg',
    '["/images/products/necklace-2.jpg"]'::jsonb,
    false,
    true,
    2, -- 목걸이 카테고리
    2, -- 에끌라린 골드 브랜드
    4.5,
    14,
    11,
    98
);

-- ========================================
-- 4. 쿠폰 데이터
-- ========================================
INSERT INTO coupons (code, title, description, discount_type, discount_value, minimum_amount, usage_limit, used_count, start_date, end_date, active) VALUES
('WELCOME20', '신규 고객 20% 할인', '신규 고객 전용 20% 할인 쿠폰', 'percentage', 20.00, 100000.00, 1000, 0, NOW(), NOW() + INTERVAL '30 days', true),
('LUNAR2024', '설날 특가 쿠폰', '설날 기념 특가 쿠폰', 'percentage', 15.00, 200000.00, 500, 12, NOW(), NOW() + INTERVAL '15 days', true),
('VIP10', 'VIP 회원 10% 할인', 'VIP 회원 전용 10% 할인 쿠폰', 'percentage', 10.00, 50000.00, 2000, 45, NOW(), NOW() + INTERVAL '60 days', true),
('SUMMER15', '여름 시즌 15% 할인', '여름 시즌 한정 15% 할인', 'percentage', 15.00, 150000.00, 800, 23, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', true),
('FREE5000', '5만원 할인 쿠폰', '5만원 이상 구매시 5천원 할인', 'fixed_amount', 5000.00, 50000.00, 10000, 156, NOW(), NOW() + INTERVAL '90 days', true);

-- ========================================
-- 5. 테스트 주문 데이터 (관리자 대시보드용)
-- ========================================

-- 먼저 테스트 사용자들 생성 (실제로는 Supabase Auth를 통해 생성됨)
-- 여기서는 주문 데이터만 생성 (user_id는 null로 설정)

INSERT INTO orders (
    order_number, customer_name, customer_email, customer_phone,
    subtotal, tax_amount, shipping_amount, discount_amount, total_amount,
    status, payment_status,
    shipping_address, billing_address,
    coupon_code, notes,
    created_at, updated_at
) VALUES
(
    'ECL20241215001',
    '김민지',
    'minji@example.com',
    '010-1234-5678',
    1500000.00, 0, 5000.00, 0, 1505000.00,
    'delivered', 'paid',
    '{"address": "서울시 강남구 테헤란로 123", "zipcode": "06142", "detail": "에이타워 15층"}'::jsonb,
    '{"address": "서울시 강남구 테헤란로 123", "zipcode": "06142", "detail": "에이타워 15층"}'::jsonb,
    null,
    '고객 요청사항: 안전하게 포장 부탁드립니다.',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
),
(
    'ECL20241215002',
    '박서준',
    'seojun@example.com',
    '010-2345-6789',
    800000.00, 0, 5000.00, 80000.00, 725000.00,
    'processing', 'paid',
    '{"address": "서울시 마포구 홍대입구로 456", "zipcode": "04043", "detail": "상가 2층"}'::jsonb,
    '{"address": "서울시 마포구 홍대입구로 456", "zipcode": "04043", "detail": "상가 2층"}'::jsonb,
    'LUNAR2024',
    null,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),
(
    'ECL20241215003',
    '이지은',
    'jieun@example.com',
    '010-3456-7890',
    350000.00, 0, 5000.00, 17500.00, 337500.00,
    'shipped', 'paid',
    '{"address": "부산시 해운대구 센텀시티로 789", "zipcode": "48058", "detail": "벡스코 근처"}'::jsonb,
    '{"address": "부산시 해운대구 센텀시티로 789", "zipcode": "48058", "detail": "벡스코 근처"}'::jsonb,
    'VIP10',
    '선물 포장 요청',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours'
),
(
    'ECL20241214001',
    '최수연',
    'suyeon@example.com',
    '010-4567-8901',
    250000.00, 0, 5000.00, 0, 255000.00,
    'pending', 'paid',
    '{"address": "대구시 중구 동성로 321", "zipcode": "41911", "detail": "동성로 쇼핑몰"}'::jsonb,
    '{"address": "대구시 중구 동성로 321", "zipcode": "41911", "detail": "동성로 쇼핑몰"}'::jsonb,
    null,
    null,
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '6 hours'
),
(
    'ECL20241213001',
    '정하늘',
    'haneul@example.com',
    '010-5678-9012',
    420000.00, 0, 5000.00, 0, 425000.00,
    'delivered', 'paid',
    '{"address": "인천시 연수구 송도동 654", "zipcode": "22001", "detail": "센트럴파크 근처"}'::jsonb,
    '{"address": "인천시 연수구 송도동 654", "zipcode": "22001", "detail": "센트럴파크 근처"}'::jsonb,
    null,
    '배송 전 연락 부탁드립니다.',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
);

-- ========================================
-- 6. 주문 아이템 데이터
-- ========================================
INSERT INTO order_items (order_id, product_id, product_title, product_sku, product_image, price, quantity, total) VALUES
-- 첫 번째 주문 (클래식 다이아몬드 반지)
(1, 1, '클래식 다이아몬드 반지', 'ECL-R-001', '/images/products/ring-1.jpg', 1500000.00, 1, 1500000.00),
-- 두 번째 주문 (진주 목걸이)
(2, 2, '진주 목걸이', 'ECL-N-001', '/images/products/necklace-1.jpg', 800000.00, 1, 800000.00),
-- 세 번째 주문 (골드 귀걸이)
(3, 3, '골드 귀걸이', 'ECL-E-001', '/images/products/earrings-1.jpg', 350000.00, 1, 350000.00),
-- 네 번째 주문 (트렌디 심플 반지)
(4, 6, '트렌디 심플 반지', 'ECL-R-002', '/images/products/ring-2.jpg', 250000.00, 1, 250000.00),
-- 다섯 번째 주문 (골드 체인 목걸이)
(5, 7, '골드 체인 목걸이', 'ECL-N-002', '/images/products/necklace-2.jpg', 420000.00, 1, 420000.00);

-- ========================================
-- 7. 확인용 쿼리 및 완료 메시지
-- ========================================

-- 데이터 삽입 확인
SELECT 
    'brands' as table_name, count(*) as count FROM brands
UNION ALL
SELECT 'categories' as table_name, count(*) as count FROM categories
UNION ALL
SELECT 'products' as table_name, count(*) as count FROM products
UNION ALL
SELECT 'orders' as table_name, count(*) as count FROM orders
UNION ALL
SELECT 'order_items' as table_name, count(*) as count FROM order_items
UNION ALL
SELECT 'coupons' as table_name, count(*) as count FROM coupons;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 샘플 데이터 삽입 완료!';
    RAISE NOTICE '📊 삽입된 데이터:';
    RAISE NOTICE '   • 브랜드: 4개';
    RAISE NOTICE '   • 카테고리: 5개';
    RAISE NOTICE '   • 상품: 7개';
    RAISE NOTICE '   • 쿠폰: 5개';
    RAISE NOTICE '   • 주문: 5개';
    RAISE NOTICE '   • 주문 아이템: 5개';
    RAISE NOTICE '';
    RAISE NOTICE '✅ 이제 홈페이지(/)와 관리자페이지(/admin)에서 같은 데이터를 사용할 수 있습니다!';
    RAISE NOTICE '';
    RAISE NOTICE '🔥 다음 단계: .env.local 파일에 Supabase 환경 변수를 설정하고 개발 서버를 재시작하세요.';
END $$; 