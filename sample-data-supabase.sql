-- 🛍️ 에끌라린 (ECLARINE) 쇼핑몰 샘플 데이터
-- 이 파일을 Supabase SQL 에디터에서 실행하여 테스트 데이터를 추가하세요
-- 에끌라린: 프리미엄 온라인 쇼핑몰

-- ========================================
-- 1. 브랜드 샘플 데이터
-- ========================================
INSERT INTO brands (name, slug, description, logo_url, is_featured, is_active) VALUES
('Apple', 'apple', '혁신적인 기술로 세상을 바꾸는 브랜드', '/assets/img/brand/apple-logo.png', true, true),
('Samsung', 'samsung', '글로벌 전자제품 리더', '/assets/img/brand/samsung-logo.png', true, true),
('Nike', 'nike', '운동과 라이프스타일의 대명사', '/assets/img/brand/nike-logo.png', true, true),
('Adidas', 'adidas', '스포츠의 모든 것', '/assets/img/brand/adidas-logo.png', false, true),
('Chanel', 'chanel', '럭셔리와 우아함의 상징', '/assets/img/brand/chanel-logo.png', true, true),
('Tiffany & Co', 'tiffany', '세계 최고의 주얼리 브랜드', '/assets/img/brand/tiffany-logo.png', true, true);

-- ========================================
-- 2. 카테고리 샘플 데이터
-- ========================================
INSERT INTO categories (name, slug, description, image_url, icon_class, sort_order, is_active) VALUES
-- 메인 카테고리
('전자제품', 'electronics', '최신 전자제품과 가전제품', '/assets/img/category/electronics.jpg', 'fas fa-laptop', 1, true),
('패션', 'fashion', '트렌디한 의류와 액세서리', '/assets/img/category/fashion.jpg', 'fas fa-tshirt', 2, true),
('주얼리', 'jewelry', '아름다운 주얼리와 시계', '/assets/img/category/jewelry.jpg', 'fas fa-gem', 3, true),
('뷰티', 'beauty', '화장품과 뷰티 제품', '/assets/img/category/beauty.jpg', 'fas fa-magic', 4, true),
('스포츠', 'sports', '운동용품과 아웃도어 장비', '/assets/img/category/sports.jpg', 'fas fa-dumbbell', 5, true);

-- 서브 카테고리 (전자제품)
INSERT INTO categories (name, slug, description, image_url, parent_id, sort_order, is_active) VALUES
('스마트폰', 'smartphones', '최신 스마트폰', '/assets/img/category/smartphones.jpg', 1, 1, true),
('노트북', 'laptops', '고성능 노트북', '/assets/img/category/laptops.jpg', 1, 2, true),
('태블릿', 'tablets', '편리한 태블릿', '/assets/img/category/tablets.jpg', 1, 3, true),
('오디오', 'audio', '이어폰, 스피커', '/assets/img/category/audio.jpg', 1, 4, true);

-- 서브 카테고리 (패션)
INSERT INTO categories (name, slug, description, image_url, parent_id, sort_order, is_active) VALUES
('남성의류', 'mens-clothing', '남성용 의류', '/assets/img/category/mens.jpg', 2, 1, true),
('여성의류', 'womens-clothing', '여성용 의류', '/assets/img/category/womens.jpg', 2, 2, true),
('신발', 'shoes', '다양한 신발', '/assets/img/category/shoes.jpg', 2, 3, true),
('가방', 'bags', '핸드백, 백팩', '/assets/img/category/bags.jpg', 2, 4, true);

-- ========================================
-- 3. 상품 샘플 데이터
-- ========================================
INSERT INTO products (
  title, slug, description, short_description, sku, price, compare_price, 
  track_quantity, quantity, type, status, featured_image, category_id, brand_id,
  is_featured, is_popular, is_bestseller, attributes, variations
) VALUES

-- 전자제품
('iPhone 15 Pro', 'iphone-15-pro', 
'최신 A17 Pro 칩셋을 탑재한 iPhone 15 Pro입니다. 혁신적인 티타늄 디자인과 향상된 카메라 시스템으로 완전히 새로운 경험을 제공합니다.',
'티타늄으로 제작된 가장 가벼운 Pro 모델', 
'IP15P-128', 1350000, 1500000, true, 50, 'simple', 'active', 
'/assets/img/product/iphone-15-pro.jpg', 6, 1, true, true, true,
'{"colors": ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"], "storage": ["128GB", "256GB", "512GB", "1TB"]}',
'[{"name": "128GB Natural Titanium", "price": 1350000, "stock": 50}, {"name": "256GB Natural Titanium", "price": 1550000, "stock": 30}]'),

('Samsung Galaxy S24 Ultra', 'galaxy-s24-ultra',
'AI가 탑재된 Galaxy S24 Ultra로 새로운 모바일 경험을 만나보세요. S펜과 함께하는 생산성의 혁신.',
'AI 기반 카메라와 S펜이 만나는 프리미엄 스마트폰',
'SGS24U-256', 1450000, 1600000, true, 40, 'simple', 'active',
'/assets/img/product/galaxy-s24-ultra.jpg', 6, 2, true, true, false,
'{"colors": ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"], "storage": ["256GB", "512GB", "1TB"]}',
'[{"name": "256GB Titanium Gray", "price": 1450000, "stock": 40}]'),

('MacBook Pro 14인치', 'macbook-pro-14',
'M3 Pro 칩이 탑재된 MacBook Pro 14인치로 전문가급 성능을 경험하세요.',
'M3 Pro 칩 탑재, 전문가를 위한 노트북',
'MBP14-M3P', 2890000, 3200000, true, 25, 'simple', 'active',
'/assets/img/product/macbook-pro-14.jpg', 7, 1, true, false, true,
'{"colors": ["Space Gray", "Silver"], "memory": ["18GB", "36GB"], "storage": ["512GB", "1TB"]}',
'[]'),

('AirPods Pro 3세대', 'airpods-pro-3',
'혁신적인 노이즈 캔슬링과 공간 음향으로 완전히 새로운 청취 경험을 제공합니다.',
'프리미엄 무선 이어폰의 완성체',
'APP3-USB', 350000, 390000, true, 100, 'simple', 'active',
'/assets/img/product/airpods-pro-3.jpg', 9, 1, false, true, true,
'{"colors": ["White"], "connector": ["USB-C", "Lightning"]}',
'[]'),

-- 패션 상품
('Nike Air Max 90', 'nike-air-max-90',
'클래식한 디자인과 현대적인 편안함이 만나는 아이코닉한 운동화입니다.',
'타임리스한 스타일의 에어 맥스',
'NAM90-WHT', 150000, 180000, true, 80, 'simple', 'active',
'/assets/img/product/nike-air-max-90.jpg', 12, 3, false, true, false,
'{"colors": ["White/Black", "Black/White", "Red/White"], "sizes": ["240", "250", "260", "270", "280", "290"]}',
'[{"name": "250 White/Black", "price": 150000, "stock": 20}, {"name": "260 White/Black", "price": 150000, "stock": 25}]'),

('Levi\'s 501 오리지널 진', 'levis-501-original',
'1873년부터 이어져 온 클래식한 스트레이트 핏 진의 원조입니다.',
'클래식 스트레이트 핏의 대명사',
'LV501-IND', 120000, 150000, true, 60, 'simple', 'active',
'/assets/img/product/levis-501.jpg', 10, null, false, false, true,
'{"colors": ["Indigo", "Black", "Light Blue"], "sizes": ["28", "30", "32", "34", "36", "38"]}',
'[]'),

-- 주얼리
('Tiffany T 스마일 팔찌', 'tiffany-t-smile-bracelet',
'18K 로즈 골드로 제작된 티파니의 시그니처 T 스마일 팔찌입니다.',
'로즈 골드 T 스마일 팔찌',
'TIF-TSB-RG', 890000, 1100000, true, 15, 'simple', 'active',
'/assets/img/product/tiffany-t-bracelet.jpg', 3, 6, true, true, false,
'{"materials": ["18K Rose Gold"], "sizes": ["Small", "Medium", "Large"]}',
'[]'),

('Cartier Love 반지', 'cartier-love-ring',
'까르띠에의 아이코닉한 러브 컬렉션 반지입니다.',
'럭셔리 골드 러브 반지',
'CAR-LR-YG', 1250000, 1400000, true, 8, 'simple', 'active',
'/assets/img/product/cartier-love-ring.jpg', 3, null, true, false, true,
'{"materials": ["18K Yellow Gold", "18K White Gold", "18K Rose Gold"], "sizes": ["49", "50", "51", "52", "53", "54"]}',
'[]'),

-- 뷰티
('Chanel Rouge Coco', 'chanel-rouge-coco',
'샤넬의 시그니처 립스틱으로 럭셔리한 발색과 보습을 동시에 제공합니다.',
'럭셔리 모이스처라이징 립스틱',
'CHA-RC-375', 55000, 65000, true, 200, 'simple', 'active',
'/assets/img/product/chanel-rouge-coco.jpg', 4, 5, false, true, false,
'{"shades": ["375 Gabrielle", "444 Gabrielle", "434 Mademoiselle"], "finish": ["Satin", "Matte"]}',
'[]'),

('Dior Forever Foundation', 'dior-forever-foundation',
'24시간 지속되는 완벽한 커버력의 디올 파운데이션입니다.',
'24시간 지속 파운데이션',
'DIO-FF-2N', 68000, 78000, true, 150, 'simple', 'active',
'/assets/img/product/dior-forever.jpg', 4, null, true, false, false,
'{"shades": ["1N", "2N", "3N", "4N", "5N"], "coverage": ["Natural", "Full"]}',
'[]');

-- ========================================
-- 4. 쿠폰 샘플 데이터
-- ========================================
INSERT INTO coupons (code, title, description, discount_type, discount_value, minimum_amount, usage_limit, start_date, end_date, active) VALUES
('WELCOME15', '신규 회원 15% 할인', '신규 회원 가입 시 첫 주문 15% 할인 (최대 5만원)', 'percentage', 15, 100000, 1000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', true),
('SUMMER30', '여름 특가 30% 할인', '여름 시즌 의류 30% 할인', 'percentage', 30, 150000, 500, NOW(), NOW() + INTERVAL '15 days', true),
('FREESHIP', '무료 배송', '5만원 이상 구매 시 무료 배송', 'free_shipping', 0, 50000, 2000, NOW(), NOW() + INTERVAL '60 days', true),
('TECH20', '전자제품 20% 할인', '모든 전자제품 20% 할인', 'percentage', 20, 200000, 100, NOW(), NOW() + INTERVAL '7 days', true),
('50KOFF', '5만원 즉시 할인', '30만원 이상 구매 시 5만원 즉시 할인', 'fixed_amount', 50000, 300000, 200, NOW(), NOW() + INTERVAL '45 days', true);

-- ========================================
-- 5. 상품 속성 업데이트 (JSON 데이터 추가)
-- ========================================
UPDATE products SET 
  gallery_images = '["image1.jpg", "image2.jpg", "image3.jpg"]',
  meta_title = title || ' - 이클라린 쇼핑몰',
  meta_description = short_description
WHERE id IN (SELECT id FROM products LIMIT 10);

-- ========================================
-- 6. 기본 사용자 주소 샘플 (테스트용)
-- ========================================
-- 실제 사용자가 가입한 후에 아래와 같은 데이터가 생성됩니다
-- INSERT INTO user_addresses (user_id, title, recipient_name, phone, address_line_1, city, postal_code, is_default) VALUES
-- ('user-uuid-here', '집', '김테스트', '010-1234-5678', '서울시 강남구 테헤란로 123', '서울시', '06142', true);

-- ========================================
-- 7. 샘플 리뷰 데이터 (실제 사용자 생성 후 추가)
-- ========================================
-- INSERT INTO product_reviews (product_id, user_id, rating, title, comment, status) VALUES
-- (1, 'user-uuid-here', 5, '정말 만족스러운 제품입니다', '배송도 빠르고 품질도 좋습니다.', 'approved');

-- ========================================
-- 8. 인기 검색어 및 추천 상품 설정
-- ========================================
-- 인기 상품 플래그 업데이트
UPDATE products SET is_popular = true WHERE id IN (1, 2, 4, 5, 7);
UPDATE products SET is_featured = true WHERE id IN (1, 3, 7, 8);
UPDATE products SET is_bestseller = true WHERE id IN (2, 3, 6, 8); 