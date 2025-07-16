-- 🗑️ 기존 모든 테이블 삭제 및 깔끔한 새 데이터베이스 생성
-- Supabase SQL 에디터에서 실행하세요

-- ========================================
-- 1단계: 기존 모든 테이블 삭제
-- ========================================

-- 기존 테이블들 삭제 (순서 중요 - 외래키 관계 고려)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 기존 뷰들 삭제
DROP VIEW IF EXISTS products_with_reviews CASCADE;
DROP VIEW IF EXISTS user_order_summary CASCADE;

-- 기존 함수들 삭제
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ========================================
-- 2단계: 새로운 깔끔한 스키마 생성
-- ========================================

-- 브랜드 테이블
CREATE TABLE brands (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 카테고리 테이블
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id BIGINT REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 상품 테이블 (홈페이지 + 관리자 페이지 공용)
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku VARCHAR(100) UNIQUE,
  
  -- 가격 정보
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  
  -- 재고 관리
  quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  
  -- 상품 메타데이터
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, draft
  
  -- 이미지
  featured_image TEXT,
  gallery_images JSONB DEFAULT '[]',
  
  -- 특별 플래그들
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  
  -- 관계
  category_id BIGINT REFERENCES categories(id),
  brand_id BIGINT REFERENCES brands(id),
  
  -- 평점 및 판매 통계
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 프로필 테이블
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(200),
  phone VARCHAR(20),
  avatar_url TEXT,
  
  -- 고객 정보
  total_spent DECIMAL(12,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 주문 테이블
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  
  -- 고객 정보 (스냅샷)
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  
  -- 금액 정보
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
  
  -- 주소 정보
  shipping_address JSONB,
  billing_address JSONB,
  
  -- 배송 정보
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- 할인 정보
  coupon_code VARCHAR(50),
  
  -- 메모
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 주문 아이템 테이블
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  
  -- 상품 정보 (주문 시점 스냅샷)
  product_title VARCHAR(255),
  product_sku VARCHAR(100),
  product_image TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 장바구니 테이블
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- 위시리스트 테이블
CREATE TABLE wishlist_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- 상품 리뷰 테이블
CREATE TABLE product_reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 쿠폰 테이블
CREATE TABLE coupons (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  
  -- 할인 정보
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed_amount
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2) DEFAULT 0,
  
  -- 사용 제한
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  
  -- 유효 기간
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- 상태
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3단계: 인덱스 생성
-- ========================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_wishlist_items_user ON wishlist_items(user_id);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);

-- ========================================
-- 4단계: 함수 생성
-- ========================================

-- 주문 번호 자동 생성 함수
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_date TEXT;
    sequence_num TEXT;
BEGIN
    -- 오늘 날짜 (YYYYMMDD)
    order_date := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- 오늘 주문 수 + 1
    SELECT LPAD((COUNT(*) + 1)::TEXT, 4, '0') INTO sequence_num
    FROM orders 
    WHERE order_number LIKE 'ECL' || order_date || '%';
    
    RETURN 'ECL' || order_date || sequence_num;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5단계: 트리거 생성
-- ========================================

-- updated_at 자동 업데이트 트리거들
CREATE TRIGGER update_brands_updated_at 
    BEFORE UPDATE ON brands 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON cart_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at 
    BEFORE UPDATE ON product_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at 
    BEFORE UPDATE ON coupons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 주문 번호 자동 생성 트리거
CREATE OR REPLACE FUNCTION set_order_number_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number_trigger();

-- ========================================
-- 6단계: RLS (Row Level Security) 설정
-- ========================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON wishlist_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own reviews" ON product_reviews FOR ALL USING (auth.uid() = user_id);

-- 공개 데이터는 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view approved reviews" ON product_reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (active = true);

-- ========================================
-- 완료 메시지
-- ========================================
DO $$
BEGIN
    RAISE NOTICE '✅ 데이터베이스 초기화 완료!';
    RAISE NOTICE '📦 생성된 테이블: brands, categories, products, user_profiles, orders, order_items, cart_items, wishlist_items, product_reviews, coupons';
    RAISE NOTICE '🔧 생성된 함수: generate_order_number(), update_updated_at_column()';
    RAISE NOTICE '⚡ 생성된 트리거: 자동 updated_at 업데이트, 주문 번호 자동 생성';
    RAISE NOTICE '🔒 RLS 정책 적용 완료';
    RAISE NOTICE '';
    RAISE NOTICE '다음 단계: 샘플 데이터를 삽입하세요!';
END $$; 