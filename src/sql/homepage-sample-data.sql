-- ========================================
-- 🔮 에끌라린 홈페이지 샘플 데이터 삽입
-- ========================================
-- 홈페이지(/)에서 사용할 실제 데이터
-- 에끌라린 쥬얼리 전문 쇼핑몰 데이터

-- 1단계: 브랜드 데이터 삽입
INSERT INTO brands (id, name, slug, description, logo_url, is_featured, is_active) VALUES
(
  uuid_generate_v4(),
  '에끌라린',
  'eclarine',
  '에끌라린 - 감성을 담은 쥬얼리 브랜드. 모든 여성이 더욱 아름답게 빛날 수 있도록 특별한 순간을 만들어갑니다.',
  '/assets/img/logo/main_logo.png',
  true,
  true
),
(
  uuid_generate_v4(),
  '에끌라린 골드',
  'eclarine-gold',
  '에끌라린 골드 컬렉션 - 프리미엄 골드 쥬얼리로 특별한 순간을 더욱 빛나게 만들어드립니다.',
  '/assets/img/logo/main_logo.png',
  true,
  true
),
(
  uuid_generate_v4(),
  '에끌라린 실버',
  'eclarine-silver',
  '에끌라린 실버 컬렉션 - 세련된 실버 쥬얼리로 일상을 더욱 우아하게 만들어드립니다.',
  '/assets/img/logo/main_logo.png',
  true,
  true
),
(
  uuid_generate_v4(),
  '에끌라린 프리미엄',
  'eclarine-premium',
  '에끌라린 프리미엄 컬렉션 - 최고급 소재와 정교한 세공으로 완성된 명품 쥬얼리입니다.',
  '/assets/img/logo/main_logo.png',
  true,
  true
);

-- 2단계: 카테고리 데이터 삽입
INSERT INTO categories (id, name, slug, description, image_url, icon, color, is_featured, is_active, sort_order) VALUES
(
  uuid_generate_v4(),
  '반지',
  'ring',
  '에끌라린 반지 컬렉션 - 로맨틱한 감성을 담은 다양한 반지들',
  '/assets/img/category/ring.jpg',
  'fas fa-ring',
  '#FFB6C1',
  true,
  true,
  1
),
(
  uuid_generate_v4(),
  '목걸이',
  'necklace',
  '에끌라린 목걸이 컬렉션 - 우아한 목선을 더욱 아름답게 만들어주는 목걸이들',
  '/assets/img/category/necklace.jpg',
  'fas fa-gem',
  '#DDA0DD',
  true,
  true,
  2
),
(
  uuid_generate_v4(),
  '귀걸이',
  'earring',
  '에끌라린 귀걸이 컬렉션 - 얼굴을 더욱 밝고 화사하게 만들어주는 귀걸이들',
  '/assets/img/category/earring.jpg',
  'fas fa-moon',
  '#87CEEB',
  true,
  true,
  3
),
(
  uuid_generate_v4(),
  '팔찌',
  'bracelet',
  '에끌라린 팔찌 컬렉션 - 손목을 더욱 우아하게 만들어주는 팔찌들',
  '/assets/img/category/bracelet.jpg',
  'fas fa-circle-notch',
  '#F0E68C',
  true,
  true,
  4
),
(
  uuid_generate_v4(),
  '브로치',
  'brooch',
  '에끌라린 브로치 컬렉션 - 옷차림에 포인트를 주는 세련된 브로치들',
  '/assets/img/category/brooch.jpg',
  'fas fa-star',
  '#DEB887',
  true,
  true,
  5
);

-- 3단계: 상품 데이터 삽입 (실제 에끌라린 상품들)
INSERT INTO products (
  id, title, slug, description, short_description, price, original_price, 
  category_id, brand_id, featured_image, gallery_images, quantity, sku, 
  status, is_featured, is_popular, is_bestseller, rating, review_count, 
  tags, attributes, meta_title, meta_description, weight, dimensions
) VALUES
-- 1. 올실버 진주토끼 귀걸이
(
  uuid_generate_v4(),
  '올실버 진주토끼 귀걸이',
  'all-silver-pearl-rabbit-earring',
  '올실버 소재로 제작된 사랑스러운 진주토끼 귀걸이입니다. 진주의 우아함과 토끼의 귀여움이 만나 특별한 매력을 연출합니다. 일상에서도 특별한 날에도 완벽하게 어울리는 디자인으로, 착용하는 순간 더욱 사랑스러운 모습을 만들어드립니다.',
  '올실버 진주토끼 귀걸이 - 사랑스러운 토끼와 진주의 만남',
  32000,
  32000,
  (SELECT id FROM categories WHERE slug = 'earring'),
  (SELECT id FROM brands WHERE slug = 'eclarine-silver'),
  '/assets/items/1.jpeg',
  '["⁢/assets/items/1.jpeg", "/assets/items/1-2.jpeg", "/assets/items/1-3.jpeg"]',
  50,
  'ECL-EAR-001',
  'active',
  true,
  true,
  false,
  4.8,
  24,
  '["올실버", "진주", "토끼", "귀걸이", "큐트"]',
  '{"material": "올실버 (All Silver)", "size": "12mm", "weight": "2.5g", "care": "실버 전용 클리너 사용", "closure": "포스트백", "pearl": "천연 담수진주"}',
  '올실버 진주토끼 귀걸이 | 에끌라린',
  '올실버 소재의 사랑스러운 진주토끼 귀걸이. 진주의 우아함과 토끼의 귀여움이 만나 특별한 매력을 연출합니다.',
  2.5,
  '12mm x 8mm'
),

-- 2. 올실버 십자가 목걸이
(
  uuid_generate_v4(),
  '올실버 십자가 목걸이',
  'all-silver-cross-necklace',
  '올실버 소재의 클래식한 십자가 목걸이입니다. 심플하면서도 의미 있는 디자인으로 일상에서 특별함을 더해줍니다. 믿음과 사랑을 상징하는 십자가 모티브가 세련되게 표현되어 있어, 종교적 의미와 패션적 감각을 동시에 만족시킵니다.',
  '올실버 십자가 목걸이 - 믿음과 사랑의 상징',
  34000,
  34000,
  (SELECT id FROM categories WHERE slug = 'necklace'),
  (SELECT id FROM brands WHERE slug = 'eclarine-silver'),
  '/assets/items/2.jpeg',
  '["⁢/assets/items/2.jpeg", "/assets/items/2-2.jpeg", "/assets/items/2-3.jpeg"]',
  40,
  'ECL-NEC-001',
  'active',
  true,
  false,
  true,
  4.9,
  31,
  '["올실버", "십자가", "목걸이", "클래식", "믿음"]',
  '{"material": "올실버 (All Silver)", "length": "45cm (조절 가능)", "pendant_size": "15mm x 20mm", "care": "실버 전용 클리너 사용", "chain": "벨처 체인"}',
  '올실버 십자가 목걸이 | 에끌라린',
  '올실버 소재의 클래식한 십자가 목걸이. 심플하면서도 의미 있는 디자인으로 일상에서 특별함을 더해줍니다.',
  5.2,
  '45cm (조절 가능)'
),

-- 3. 블링블링 실버 체인 팔찌
(
  uuid_generate_v4(),
  '블링블링 실버 체인 팔찌',
  'bling-bling-silver-chain-bracelet',
  '올실버 소재에 플래티넘 도금을 입힌 화려한 체인 팔찌입니다. 블링블링한 광채가 손목을 더욱 우아하게 만들어줍니다. 정교한 체인 연결과 플래티넘 도금의 고급스러운 광택이 어우러져 특별한 순간을 더욱 빛나게 만들어드립니다.',
  '블링블링 실버 체인 팔찌 - 플래티넘 도금의 화려함',
  96000,
  96000,
  (SELECT id FROM categories WHERE slug = 'bracelet'),
  (SELECT id FROM brands WHERE slug = 'eclarine-premium'),
  '/assets/items/3.jpeg',
  '["⁢/assets/items/3.jpeg", "/assets/items/3-2.jpeg", "/assets/items/3-3.jpeg"]',
  25,
  'ECL-BRA-001',
  'active',
  true,
  true,
  false,
  4.7,
  18,
  '["올실버", "플래티넘 도금", "체인", "팔찌", "블링"]',
  '{"material": "올실버 (All Silver) / 플래티넘 도금", "length": "17cm (조절 가능)", "chain_width": "4mm", "care": "부드러운 천으로 닦기", "closure": "로브스터 클라스프"}',
  '블링블링 실버 체인 팔찌 | 에끌라린',
  '올실버 소재에 플래티넘 도금을 입힌 화려한 체인 팔찌. 블링블링한 광채가 손목을 더욱 우아하게 만들어줍니다.',
  8.3,
  '17cm (조절 가능)'
),

-- 4. 데이지 실버 딱붙 귀걸이
(
  uuid_generate_v4(),
  '데이지 실버 딱붙 귀걸이',
  'daisy-silver-stud-earring',
  '올실버 소재의 귀여운 데이지 꽃 모양 딱붙 귀걸이입니다. 작고 깔끔한 디자인으로 일상 착용에 완벽합니다. 봄의 전령사 데이지 꽃을 모티브로 한 섬세한 디자인이 착용자의 얼굴을 더욱 밝고 상쾌하게 만들어줍니다.',
  '데이지 실버 딱붙 귀걸이 - 봄의 전령사 데이지',
  18000,
  18000,
  (SELECT id FROM categories WHERE slug = 'earring'),
  (SELECT id FROM brands WHERE slug = 'eclarine-silver'),
  '/assets/items/4.jpeg',
  '["⁢/assets/items/4.jpeg", "/assets/items/4-2.jpeg", "/assets/items/4-3.jpeg"]',
  80,
  'ECL-EAR-002',
  'active',
  false,
  true,
  true,
  4.6,
  42,
  '["올실버", "데이지", "꽃", "딱붙", "귀걸이"]',
  '{"material": "올실버 (All Silver)", "size": "8mm", "weight": "1.2g", "care": "실버 전용 클리너 사용", "closure": "포스트백"}',
  '데이지 실버 딱붙 귀걸이 | 에끌라린',
  '올실버 소재의 귀여운 데이지 꽃 모양 딱붙 귀걸이. 작고 깔끔한 디자인으로 일상 착용에 완벽합니다.',
  1.2,
  '8mm'
),

-- 5. 로맨틱 하트 실버 반지
(
  uuid_generate_v4(),
  '로맨틱 하트 실버 반지',
  'romantic-heart-silver-ring',
  '올실버 소재의 로맨틱한 하트 모양 반지입니다. 사랑의 마음을 담은 하트 디자인이 특별한 의미를 전달합니다. 섬세한 세공과 부드러운 곡선이 어우러져 착용자의 손을 더욱 우아하게 만들어주는 특별한 반지입니다.',
  '로맨틱 하트 실버 반지 - 사랑의 마음을 담은 하트',
  45000,
  45000,
  (SELECT id FROM categories WHERE slug = 'ring'),
  (SELECT id FROM brands WHERE slug = 'eclarine-silver'),
  '/assets/items/5.jpeg',
  '["⁢/assets/items/5.jpeg", "/assets/items/5-2.jpeg", "/assets/items/5-3.jpeg"]',
  60,
  'ECL-RIN-001',
  'active',
  true,
  false,
  true,
  4.5,
  28,
  '["올실버", "하트", "반지", "로맨틱", "사랑"]',
  '{"material": "올실버 (All Silver)", "size": "프리사이즈 (조절 가능)", "weight": "3.2g", "care": "실버 전용 클리너 사용", "heart_size": "10mm"}',
  '로맨틱 하트 실버 반지 | 에끌라린',
  '올실버 소재의 로맨틱한 하트 모양 반지. 사랑의 마음을 담은 하트 디자인이 특별한 의미를 전달합니다.',
  3.2,
  '프리사이즈'
),

-- 6. 엘레강트 펄 목걸이
(
  uuid_generate_v4(),
  '엘레강트 펄 목걸이',
  'elegant-pearl-necklace',
  '고급 담수진주와 올실버 체인이 조화를 이룬 엘레강트한 펄 목걸이입니다. 진주의 자연스러운 광택과 실버의 세련된 느낌이 완벽하게 어우러져 어떤 스타일에도 품격을 더해줍니다. 특별한 날이나 중요한 모임에서 당신의 우아함을 한층 더 돋보이게 만들어줍니다.',
  '엘레강트 펄 목걸이 - 담수진주와 실버의 조화',
  78000,
  78000,
  (SELECT id FROM categories WHERE slug = 'necklace'),
  (SELECT id FROM brands WHERE slug = 'eclarine-premium'),
  '/assets/items/6.jpeg',
  '["⁢/assets/items/6.jpeg", "/assets/items/6-2.jpeg", "/assets/items/6-3.jpeg"]',
  35,
  'ECL-NEC-002',
  'active',
  true,
  true,
  false,
  4.8,
  22,
  '["올실버", "담수진주", "펄", "목걸이", "엘레강트"]',
  '{"material": "올실버 (All Silver), 담수진주", "length": "42cm (조절 가능)", "pearl_size": "6-7mm", "care": "부드러운 천으로 닦기", "chain": "벨처 체인"}',
  '엘레강트 펄 목걸이 | 에끌라린',
  '고급 담수진주와 올실버 체인이 조화를 이룬 엘레강트한 펄 목걸이. 진주의 자연스러운 광택과 실버의 세련된 느낌이 완벽하게 어우러집니다.',
  6.8,
  '42cm (조절 가능)'
),

-- 7. 미니멀 실버 이어커프
(
  uuid_generate_v4(),
  '미니멀 실버 이어커프',
  'minimal-silver-ear-cuff',
  '올실버 소재의 미니멀한 이어커프입니다. 구멍 없이 착용할 수 있는 편리함과 세련된 디자인을 동시에 만족시킵니다. 심플하면서도 모던한 디자인으로 일상에서 자연스럽게 포인트를 줄 수 있는 특별한 액세서리입니다.',
  '미니멀 실버 이어커프 - 구멍 없이 착용하는 세련됨',
  28000,
  28000,
  (SELECT id FROM categories WHERE slug = 'earring'),
  (SELECT id FROM brands WHERE slug = 'eclarine-silver'),
  '/assets/items/7.jpeg',
  '["⁢/assets/items/7.jpeg", "/assets/items/7-2.jpeg", "/assets/items/7-3.jpeg"]',
  45,
  'ECL-EAR-003',
  'active',
  false,
  true,
  false,
  4.4,
  16,
  '["올실버", "이어커프", "미니멀", "모던", "무구멍"]',
  '{"material": "올실버 (All Silver)", "size": "12mm", "weight": "1.8g", "care": "실버 전용 클리너 사용", "closure": "클립온"}',
  '미니멀 실버 이어커프 | 에끌라린',
  '올실버 소재의 미니멀한 이어커프. 구멍 없이 착용할 수 있는 편리함과 세련된 디자인을 동시에 만족시킵니다.',
  1.8,
  '12mm'
),

-- 8. 클래식 실버 체인 팔찌
(
  uuid_generate_v4(),
  '클래식 실버 체인 팔찌',
  'classic-silver-chain-bracelet',
  '올실버 소재의 클래식한 체인 팔찌입니다. 심플하면서도 우아한 디자인으로 어떤 스타일에도 잘 어울립니다. 정교한 체인 연결과 견고한 마감으로 오랫동안 변함없는 아름다움을 유지할 수 있습니다.',
  '클래식 실버 체인 팔찌 - 심플함의 완성',
  52000,
  52000,
  (SELECT id FROM categories WHERE slug = 'bracelet'),
  (SELECT id FROM brands WHERE slug = 'eclarine-silver'),
  '/assets/items/8.jpeg',
  '["⁢/assets/items/8.jpeg", "/assets/items/8-2.jpeg", "/assets/items/8-3.jpeg"]',
  55,
  'ECL-BRA-002',
  'active',
  true,
  false,
  true,
  4.7,
  33,
  '["올실버", "체인", "팔찌", "클래식", "심플"]',
  '{"material": "올실버 (All Silver)", "length": "18cm (조절 가능)", "chain_width": "3mm", "care": "실버 전용 클리너 사용", "closure": "로브스터 클라스프"}',
  '클래식 실버 체인 팔찌 | 에끌라린',
  '올실버 소재의 클래식한 체인 팔찌. 심플하면서도 우아한 디자인으로 어떤 스타일에도 잘 어울립니다.',
  4.5,
  '18cm (조절 가능)'
);

-- 4단계: 쿠폰 데이터 삽입
INSERT INTO coupons (
  id, code, title, description, discount_type, discount_value, 
  minimum_amount, maximum_discount, usage_limit, user_limit, 
  start_date, end_date, is_active
) VALUES
(
  uuid_generate_v4(),
  'WELCOME20',
  '신규 회원 환영 쿠폰',
  '에끌라린에 오신 것을 환영합니다! 첫 구매 시 20% 할인 혜택을 드립니다.',
  'percentage',
  20.00,
  30000,
  50000,
  1000,
  1,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '30 days',
  true
),
(
  uuid_generate_v4(),
  'LUNAR2024',
  '설날 특가 쿠폰',
  '2024년 설날을 맞아 특별한 할인 혜택을 제공합니다.',
  'percentage',
  15.00,
  50000,
  100000,
  500,
  2,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '14 days',
  true
),
(
  uuid_generate_v4(),
  'VIP10',
  'VIP 회원 전용 쿠폰',
  'VIP 회원님을 위한 특별 할인 쿠폰입니다.',
  'fixed_amount',
  10000,
  100000,
  NULL,
  100,
  3,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '60 days',
  true
),
(
  uuid_generate_v4(),
  'SUMMER15',
  '여름 시즌 할인 쿠폰',
  '여름을 맞아 시원한 할인 혜택을 드립니다.',
  'percentage',
  15.00,
  40000,
  60000,
  300,
  1,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '90 days',
  true
),
(
  uuid_generate_v4(),
  'FREESHIP',
  '무료배송 쿠폰',
  '배송비 걱정 없이 쇼핑하세요!',
  'fixed_amount',
  3000,
  50000,
  3000,
  200,
  1,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '45 days',
  true
);

-- 5단계: 테스트 사용자 프로필 생성 (UUID 기반)
-- 참고: 실제 사용자는 Supabase Auth를 통해 생성되므로 여기서는 예시만 제공
-- 실제 환경에서는 auth.users에 사용자가 먼저 생성되어야 합니다.

-- 6단계: 테이블 정보 업데이트
UPDATE brands SET updated_at = NOW();
UPDATE categories SET updated_at = NOW();  
UPDATE products SET updated_at = NOW();
UPDATE coupons SET updated_at = NOW();

-- 7단계: 통계 확인
DO $$
DECLARE
    brand_count INTEGER;
    category_count INTEGER;
    product_count INTEGER;
    coupon_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO brand_count FROM brands;
    SELECT COUNT(*) INTO category_count FROM categories;
    SELECT COUNT(*) INTO product_count FROM products;
    SELECT COUNT(*) INTO coupon_count FROM coupons;
    
    RAISE NOTICE '✅ 에끌라린 샘플 데이터 삽입 완료!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 삽입된 데이터 통계:';
    RAISE NOTICE '   🏷️  브랜드: % 개', brand_count;
    RAISE NOTICE '   📂 카테고리: % 개', category_count;
    RAISE NOTICE '   💎 상품: % 개', product_count;
    RAISE NOTICE '   🎫 쿠폰: % 개', coupon_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔮 에끌라린 쇼핑몰 데이터 준비 완료!';
    RAISE NOTICE '';
    RAISE NOTICE '🛒 다음 단계:';
    RAISE NOTICE '   1. 홈페이지(/)에서 상품 확인';
    RAISE NOTICE '   2. 장바구니 기능 테스트';
    RAISE NOTICE '   3. 주문 프로세스 테스트';
    RAISE NOTICE '';
    RAISE NOTICE '💡 참고사항:';
    RAISE NOTICE '   - 사용자 회원가입 후 user_profiles 테이블에 프로필 생성';
    RAISE NOTICE '   - 상품 이미지는 /assets/items/ 경로에 업로드 필요';
    RAISE NOTICE '   - 쿠폰은 체크아웃 시 사용 가능';
END $$; 