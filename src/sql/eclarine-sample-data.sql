-- ================================================================
-- 에끌라린 쇼핑몰 샘플 데이터 (외부 API 호환)
-- ================================================================

-- 1. 브랜드 데이터
INSERT INTO brands (_id, name, logo, email, website, location) VALUES
('brand_eclarine_001', 'ECLARINE', 'https://your-supabase-url.supabase.co/storage/v1/object/public/brand-logos/eclarine-logo.png', 'info@eclarine.com', 'https://eclarine.com', 'Seoul, Korea');

-- 2. 카테고리 데이터 (계층 구조)
INSERT INTO categories (_id, name, slug, description, image, parent, children) VALUES
('cat_jewelry_001', 'Jewelry', 'jewelry', '에끌라린 쥬얼리 컬렉션', 'https://your-supabase-url.supabase.co/storage/v1/object/public/category-images/jewelry.jpg', '', '["cat_silver_001", "cat_gold_001"]'),
('cat_silver_001', 'All Silver', 'all-silver', '올실버 컬렉션', 'https://your-supabase-url.supabase.co/storage/v1/object/public/category-images/silver.jpg', 'cat_jewelry_001', '[]'),
('cat_gold_001', 'Gold', 'gold', '골드 컬렉션', 'https://your-supabase-url.supabase.co/storage/v1/object/public/category-images/gold.jpg', 'cat_jewelry_001', '[]');

-- 3. 상품 데이터 (외부 API 호환)
INSERT INTO products (
    _id, sku, title, slug, description, img, imageURLs, 
    category, brand, price, originalPrice, quantity, sold, 
    discount, featured, status, tags, additionalInformation, 
    reviews, rating, totalReviews
) VALUES
(
    'prod_pearl_rabbit_001',
    'ECL-PR-001',
    '올실버 진주토끼 귀걸이',
    'all-silver-pearl-rabbit-earring',
    '귀여운 토끼 모양의 진주 귀걸이입니다. 올실버 소재로 제작되어 알레르기 걱정 없이 착용하실 수 있습니다.',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/featured/pearl-rabbit-1.jpg',
    '[
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/pearl-rabbit-1.jpg"},
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/pearl-rabbit-2.jpg"},
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/pearl-rabbit-3.jpg"}
    ]',
    '{"name": "All Silver", "id": "cat_silver_001"}',
    '{"name": "ECLARINE", "id": "brand_eclarine_001"}',
    32000,
    32000,
    50,
    8,
    0,
    true,
    'in-stock',
    '["귀걸이", "실버", "진주", "토끼", "귀여운"]',
    '[
        {"key": "소재", "value": "925 Sterling Silver"},
        {"key": "크기", "value": "1.2cm x 1.0cm"},
        {"key": "무게", "value": "2.5g"},
        {"key": "관리법", "value": "부드러운 천으로 닦아주세요"}
    ]',
    '[]',
    4.5,
    12
),
(
    'prod_cross_necklace_001',
    'ECL-CN-001',
    '올실버 십자가 목걸이',
    'all-silver-cross-necklace',
    '클래식한 십자가 목걸이입니다. 심플하면서도 우아한 디자인으로 데일리 착용에 완벽합니다.',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/featured/cross-necklace-1.jpg',
    '[
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/cross-necklace-1.jpg"},
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/cross-necklace-2.jpg"}
    ]',
    '{"name": "All Silver", "id": "cat_silver_001"}',
    '{"name": "ECLARINE", "id": "brand_eclarine_001"}',
    34000,
    34000,
    30,
    5,
    0,
    true,
    'in-stock',
    '["목걸이", "실버", "십자가", "클래식"]',
    '[
        {"key": "소재", "value": "925 Sterling Silver"},
        {"key": "체인길이", "value": "45cm (조절 가능)"},
        {"key": "펜던트크기", "value": "1.5cm x 1.0cm"},
        {"key": "관리법", "value": "물기 제거 후 보관"}
    ]',
    '[]',
    4.3,
    8
),
(
    'prod_chain_bracelet_001',
    'ECL-CB-001',
    '블링블링 실버 체인 팔찌',
    'bling-silver-chain-bracelet',
    '화려한 체인 디자인의 실버 팔찌입니다. 블링블링한 매력으로 손목을 돋보이게 해줍니다.',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/featured/chain-bracelet-1.jpg',
    '[
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/chain-bracelet-1.jpg"},
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/chain-bracelet-2.jpg"},
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/chain-bracelet-3.jpg"}
    ]',
    '{"name": "All Silver", "id": "cat_silver_001"}',
    '{"name": "ECLARINE", "id": "brand_eclarine_001"}',
    96000,
    96000,
    15,
    2,
    0,
    true,
    'in-stock',
    '["팔찌", "실버", "체인", "블링블링", "화려한"]',
    '[
        {"key": "소재", "value": "925 Sterling Silver"},
        {"key": "길이", "value": "17cm (조절 가능)"},
        {"key": "무게", "value": "8.5g"},
        {"key": "관리법", "value": "전용 클리너 사용 권장"}
    ]',
    '[]',
    4.8,
    5
),
(
    'prod_daisy_earring_001',
    'ECL-DE-001',
    '데이지 실버 딱붙 귀걸이',
    'daisy-silver-stud-earring',
    '데이지 꽃 모양의 작고 귀여운 딱붙 귀걸이입니다. 일상 착용에 부담 없는 사이즈입니다.',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/featured/daisy-earring-1.jpg',
    '[
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/daisy-earring-1.jpg"},
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/daisy-earring-2.jpg"}
    ]',
    '{"name": "All Silver", "id": "cat_silver_001"}',
    '{"name": "ECLARINE", "id": "brand_eclarine_001"}',
    18000,
    18000,
    100,
    25,
    0,
    true,
    'in-stock',
    '["귀걸이", "실버", "데이지", "꽃", "딱붙", "미니멀"]',
    '[
        {"key": "소재", "value": "925 Sterling Silver"},
        {"key": "크기", "value": "0.8cm x 0.8cm"},
        {"key": "무게", "value": "1.2g"},
        {"key": "관리법", "value": "부드러운 천으로 닦아주세요"}
    ]',
    '[]',
    4.6,
    18
),
(
    'prod_heart_gem_earring_001',
    'ECL-HGE-001',
    '올실버 하트 보석 귀걸이',
    'all-silver-heart-gem-earring',
    '하트 모양에 큐빅 보석이 세팅된 로맨틱한 귀걸이입니다. 특별한 날에 완벽한 액세서리입니다.',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/featured/heart-gem-earring-1.jpg',
    '[
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/heart-gem-earring-1.jpg"},
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/heart-gem-earring-2.jpg"},
        {"color": "silver", "img": "https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/gallery/heart-gem-earring-3.jpg"}
    ]',
    '{"name": "All Silver", "id": "cat_silver_001"}',
    '{"name": "ECLARINE", "id": "brand_eclarine_001"}',
    33000,
    33000,
    40,
    12,
    0,
    true,
    'in-stock',
    '["귀걸이", "실버", "하트", "보석", "큐빅", "로맨틱"]',
    '[
        {"key": "소재", "value": "925 Sterling Silver + Cubic Zirconia"},
        {"key": "크기", "value": "1.0cm x 1.0cm"},
        {"key": "무게", "value": "1.8g"},
        {"key": "관리법", "value": "물기 제거 후 보관"}
    ]',
    '[]',
    4.7,
    15
);

-- 4. 사용자 프로필 (관리자 계정)
INSERT INTO user_profiles (
    _id, name, email, phone, avatar, role, account_type, 
    date_of_birth, gender, address, city, country, zip_code, 
    bio, website, is_active, email_verified, phone_verified
) VALUES
(
    'user_admin_001',
    '에끌라린 관리자',
    'admin@eclarine.com',
    '010-1234-5678',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/user-avatars/default-admin.jpg',
    'admin',
    'admin',
    '1990-01-01',
    'other',
    '서울특별시 강남구 테헤란로 123',
    '서울',
    '대한민국',
    '06234',
    '에끌라린 쇼핑몰 관리자입니다.',
    'https://eclarine.com',
    true,
    true,
    true
);

-- 5. 쿠폰 데이터
INSERT INTO coupons (
    _id, title, coupon_code, end_time, discount_percentage, 
    discount_amount, minimum_amount, product_type, start_time, 
    status, free_shipping
) VALUES
('coupon_welcome_001', '신규 회원 웰컴 쿠폰', 'WELCOME10', '2024-12-31 23:59:59', 10, 0, 30000, 'All', '2024-01-01 00:00:00', 'active', false),
('coupon_silver_001', '실버 컬렉션 특가', 'SILVER20', '2024-12-31 23:59:59', 20, 0, 50000, 'All Silver', '2024-01-01 00:00:00', 'active', false),
('coupon_freeship_001', '무료배송 쿠폰', 'FREESHIP', '2024-12-31 23:59:59', 0, 0, 50000, 'All', '2024-01-01 00:00:00', 'active', true),
('coupon_10k_001', '10,000원 할인쿠폰', '10000OFF', '2024-12-31 23:59:59', 0, 10000, 100000, 'All', '2024-01-01 00:00:00', 'active', false),
('coupon_vip_001', 'VIP 회원 특별 할인', 'VIP25', '2024-12-31 23:59:59', 25, 0, 200000, 'All', '2024-01-01 00:00:00', 'active', true);

-- 6. 상품 리뷰 데이터
INSERT INTO product_reviews (
    _id, product_id, user_id, rating, review, date, status
) VALUES
-- 올실버 진주토끼 귀걸이 리뷰
('review_001', 'prod_pearl_rabbit_001', 'user_admin_001', 5, '너무 귀여워요! 진주가 반짝반짝 빛나고 토끼 모양이 정말 사랑스러워요.', '2024-01-15 10:30:00', 'active'),
('review_002', 'prod_pearl_rabbit_001', 'user_admin_001', 4, '품질이 좋고 가격도 합리적이에요. 배송도 빨랐습니다.', '2024-01-20 14:20:00', 'active'),
('review_003', 'prod_pearl_rabbit_001', 'user_admin_001', 5, '선물로 샀는데 너무 좋아해요. 포장도 예쁘게 해주셔서 감사합니다.', '2024-01-25 16:45:00', 'active'),

-- 올실버 십자가 목걸이 리뷰
('review_004', 'prod_cross_necklace_001', 'user_admin_001', 4, '심플하고 예뻐요. 길이도 적당하고 매일 착용하기 좋습니다.', '2024-01-18 09:15:00', 'active'),
('review_005', 'prod_cross_necklace_001', 'user_admin_001', 5, '실버 질감이 좋고 변색도 안 되네요. 만족합니다.', '2024-01-22 11:30:00', 'active'),

-- 블링블링 실버 체인 팔찌 리뷰
('review_006', 'prod_chain_bracelet_001', 'user_admin_001', 5, '정말 블링블링해요! 손목이 화려해 보입니다.', '2024-01-19 13:20:00', 'active'),

-- 데이지 실버 딱붙 귀걸이 리뷰
('review_007', 'prod_daisy_earring_001', 'user_admin_001', 4, '작고 귀여워요. 일상 착용하기 딱 좋은 사이즈입니다.', '2024-01-16 15:10:00', 'active'),
('review_008', 'prod_daisy_earring_001', 'user_admin_001', 5, '가격 대비 품질이 훌륭해요. 또 주문할 예정입니다.', '2024-01-21 17:25:00', 'active'),

-- 올실버 하트 보석 귀걸이 리뷰
('review_009', 'prod_heart_gem_earring_001', 'user_admin_001', 5, '보석이 정말 반짝반짝해요! 특별한 날에 착용하기 완벽합니다.', '2024-01-17 12:40:00', 'active'),
('review_010', 'prod_heart_gem_earring_001', 'user_admin_001', 4, '하트 모양이 예쁘고 크기도 적당해요. 추천합니다.', '2024-01-23 14:55:00', 'active');

-- 7. 리뷰 ID를 상품에 연결
UPDATE products SET reviews = '["review_001", "review_002", "review_003"]' WHERE _id = 'prod_pearl_rabbit_001';
UPDATE products SET reviews = '["review_004", "review_005"]' WHERE _id = 'prod_cross_necklace_001';
UPDATE products SET reviews = '["review_006"]' WHERE _id = 'prod_chain_bracelet_001';
UPDATE products SET reviews = '["review_007", "review_008"]' WHERE _id = 'prod_daisy_earring_001';
UPDATE products SET reviews = '["review_009", "review_010"]' WHERE _id = 'prod_heart_gem_earring_001';

-- ================================================================
-- 완료 메시지
-- ================================================================
-- 에끌라린 쇼핑몰 샘플 데이터가 성공적으로 삽입되었습니다!
-- 
-- 생성된 데이터:
-- - 브랜드: 1개 (ECLARINE)
-- - 카테고리: 3개 (Jewelry, All Silver, Gold)
-- - 상품: 5개 (에끌라린 쥬얼리 컬렉션)
-- - 사용자: 1개 (관리자 계정)
-- - 쿠폰: 5개 (다양한 할인 쿠폰)
-- - 리뷰: 10개 (상품별 고객 리뷰)
-- 
-- 다음 단계:
-- 1. 실제 상품 이미지를 Storage에 업로드
-- 2. 이미지 URL을 실제 Supabase Storage URL로 변경
-- 3. 프론트엔드에서 API 연동 테스트
-- ================================================================ 