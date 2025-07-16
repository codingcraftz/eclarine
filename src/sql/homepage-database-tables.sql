-- ========================================
-- 🔮 에끌라린 홈페이지 데이터베이스 테이블 구조
-- ========================================
-- 홈페이지(/)에서 사용하는 모든 기능을 위한 완전한 스키마
-- UUID 기반 설계 / 에끌라린 쥬얼리 전문 쇼핑몰

-- 1단계: 기존 테이블들 정리 (필요시)
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS comparison_items CASCADE;
DROP TABLE IF EXISTS user_addresses CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;

-- 2단계: 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3단계: 테이블 생성

-- 브랜드 테이블 (에끌라린 컬렉션)
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 카테고리 테이블 (쥬얼리 타입)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  icon VARCHAR(100),
  color VARCHAR(50),
  parent_id UUID REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 상품 테이블 (쥬얼리 제품)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- 가격 정보
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- 관계
  category_id UUID REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  
  -- 이미지 (JSON 배열로 저장)
  featured_image VARCHAR(500),
  gallery_images JSONB DEFAULT '[]',
  
  -- 재고 및 상태
  quantity INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, out-of-stock
  
  -- 특별 플래그
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  
  -- 평점 및 리뷰
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- 태그 (JSON 배열)
  tags JSONB DEFAULT '[]',
  
  -- 상품 속성 (JSON 객체)
  attributes JSONB DEFAULT '{}', -- material, size, weight, care 등
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- 추가 정보
  weight DECIMAL(8,2),
  dimensions VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 프로필 테이블 (Supabase auth.users 확장)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  date_of_birth DATE,
  gender VARCHAR(10),
  
  -- 선호 정보
  preferred_language VARCHAR(10) DEFAULT 'ko',
  preferred_currency VARCHAR(10) DEFAULT 'KRW',
  
  -- 마케팅 동의
  marketing_consent BOOLEAN DEFAULT false,
  
  -- 계정 상태
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 배송 주소 테이블
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 배송 정보
  recipient_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT '대한민국',
  
  -- 주소 타입
  address_type VARCHAR(20) DEFAULT 'home', -- home, work, other
  is_default BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 주문 테이블
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 주문 상태
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
  
  -- 금액 정보
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- 배송 정보
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  
  -- 결제 정보
  payment_method VARCHAR(50), -- card, cod, bank_transfer
  payment_data JSONB DEFAULT '{}',
  
  -- 배송 정보
  shipping_method VARCHAR(50) DEFAULT 'standard',
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- 기타
  order_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 주문 아이템 테이블
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  
  -- 주문 당시 상품 정보 (스냅샷)
  product_title VARCHAR(255) NOT NULL,
  product_image VARCHAR(500),
  product_sku VARCHAR(100),
  
  -- 수량 및 가격
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- 할인 정보
  discount_amount DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 장바구니 아이템 테이블
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- 위시리스트 아이템 테이블
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- 상품 비교 테이블
CREATE TABLE comparison_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- 상품 리뷰 테이블
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  
  -- 리뷰 내용
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- 이미지 (JSON 배열)
  review_images JSONB DEFAULT '[]',
  
  -- 추천 정보
  helpful_count INTEGER DEFAULT 0,
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  
  -- 관리자 답변
  admin_reply TEXT,
  admin_reply_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 쿠폰 테이블
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  
  -- 할인 정보
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed_amount
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2) DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  
  -- 사용 제한
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  user_limit INTEGER DEFAULT 1, -- 사용자당 사용 가능 횟수
  
  -- 유효 기간
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- 적용 조건
  applicable_categories JSONB DEFAULT '[]',
  applicable_products JSONB DEFAULT '[]',
  
  -- 상태
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 쿠폰 사용 내역 테이블
CREATE TABLE user_coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, coupon_id, order_id)
);

-- 결제 수단 테이블
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 결제 수단 정보
  payment_type VARCHAR(20) NOT NULL, -- card, bank_account
  provider VARCHAR(50), -- stripe, paypal, etc.
  
  -- 카드 정보 (암호화됨)
  card_last4 VARCHAR(4),
  card_brand VARCHAR(20),
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  
  -- 기타
  is_default BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4단계: 인덱스 생성
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_popular ON products(is_popular);
CREATE INDEX idx_products_bestseller ON products(is_bestseller);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_wishlist_items_user ON wishlist_items(user_id);
CREATE INDEX idx_comparison_items_user ON comparison_items(user_id);

CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_user ON product_reviews(user_id);
CREATE INDEX idx_reviews_status ON product_reviews(status);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_coupons_dates ON coupons(start_date, end_date);

-- 5단계: 함수 생성

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

-- 상품 평점 업데이트 함수
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET 
        rating = (
            SELECT ROUND(AVG(rating::DECIMAL), 1) 
            FROM product_reviews 
            WHERE product_id = NEW.product_id AND status = 'approved'
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM product_reviews 
            WHERE product_id = NEW.product_id AND status = 'approved'
        )
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6단계: 트리거 생성

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

-- 상품 평점 업데이트 트리거
CREATE TRIGGER update_product_rating_trigger
    AFTER INSERT OR UPDATE ON product_reviews
    FOR EACH ROW
    WHEN (NEW.status = 'approved')
    EXECUTE FUNCTION update_product_rating();

-- 7단계: RLS (Row Level Security) 정책 설정
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "사용자는 자신의 프로필만 관리" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "사용자는 자신의 주소만 관리" ON user_addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 주문만 조회" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 주문만 생성" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 장바구니만 관리" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 위시리스트만 관리" ON wishlist_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 비교목록만 관리" ON comparison_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 리뷰만 관리" ON product_reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 쿠폰 사용내역만 조회" ON user_coupon_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 결제수단만 관리" ON payment_methods FOR ALL USING (auth.uid() = user_id);

-- 공개 데이터는 모든 사용자가 조회 가능
CREATE POLICY "활성 상품은 누구나 조회 가능" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "활성 카테고리는 누구나 조회 가능" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "활성 브랜드는 누구나 조회 가능" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "승인된 리뷰는 누구나 조회 가능" ON product_reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "활성 쿠폰은 누구나 조회 가능" ON coupons FOR SELECT USING (is_active = true);

-- 주문 아이템은 해당 주문 소유자만 조회 가능
CREATE POLICY "주문 아이템은 주문 소유자만 조회 가능" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- 8단계: 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ 에끌라린 홈페이지 데이터베이스 구조 생성 완료!';
    RAISE NOTICE '';
    RAISE NOTICE '📦 생성된 테이블들:';
    RAISE NOTICE '   🏷️  brands (브랜드)';
    RAISE NOTICE '   📂 categories (카테고리)';
    RAISE NOTICE '   💎 products (상품)';
    RAISE NOTICE '   👤 user_profiles (사용자 프로필)';
    RAISE NOTICE '   📍 user_addresses (배송 주소)';
    RAISE NOTICE '   🛒 orders (주문)';
    RAISE NOTICE '   📝 order_items (주문 아이템)';
    RAISE NOTICE '   🛍️  cart_items (장바구니)';
    RAISE NOTICE '   ❤️  wishlist_items (위시리스트)';
    RAISE NOTICE '   ⚖️  comparison_items (상품 비교)';
    RAISE NOTICE '   ⭐ product_reviews (리뷰)';
    RAISE NOTICE '   🎫 coupons (쿠폰)';
    RAISE NOTICE '   🏦 payment_methods (결제수단)';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 자동 생성 기능:';
    RAISE NOTICE '   - 주문 번호 자동 생성 (ECL20241215001)';
    RAISE NOTICE '   - updated_at 자동 업데이트';
    RAISE NOTICE '   - 상품 평점 자동 계산';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 보안 정책 적용:';
    RAISE NOTICE '   - 사용자별 데이터 접근 제한';
    RAISE NOTICE '   - 공개 데이터 조회 허용';
    RAISE NOTICE '';
    RAISE NOTICE '📋 다음 단계: 샘플 데이터 삽입';
END $$; 