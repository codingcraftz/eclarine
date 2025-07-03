-- 🛍️ 완전한 쇼핑몰 Supabase 데이터베이스 스키마
-- 이 파일을 Supabase SQL 에디터에서 실행하세요

-- ========================================
-- 1. 브랜드 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS brands (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. 카테고리 테이블 (계층 구조 지원)
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon_class VARCHAR(100), -- FontAwesome 아이콘 클래스
  parent_id BIGINT REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. 상품 테이블 (확장된 버전)
-- ========================================
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku VARCHAR(100) UNIQUE,
  
  -- 가격 정보
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  
  -- 재고 관리
  track_quantity BOOLEAN DEFAULT true,
  quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  
  -- 물리적 속성
  weight DECIMAL(8,2),
  
  -- 상품 메타데이터
  type VARCHAR(50) DEFAULT 'simple', -- simple, variable, grouped, digital
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, draft
  visibility VARCHAR(20) DEFAULT 'public', -- public, private
  
  -- 이미지 및 미디어
  featured_image TEXT,
  gallery_images JSONB DEFAULT '[]',
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- 특별 플래그들
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_digital BOOLEAN DEFAULT false,
  
  -- 관계
  category_id BIGINT REFERENCES categories(id),
  brand_id BIGINT REFERENCES brands(id),
  
  -- 평점 (캐시용)
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- 판매 통계 (캐시용)
  sales_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- 추가 속성 (JSON으로 저장)
  attributes JSONB DEFAULT '{}',
  variations JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. 사용자 프로필 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(200),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  avatar_url TEXT,
  
  -- 환경 설정
  newsletter_subscribed BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'ko',
  currency VARCHAR(3) DEFAULT 'KRW',
  
  -- 고객 등급
  customer_tier VARCHAR(20) DEFAULT 'bronze', -- bronze, silver, gold, platinum
  total_spent DECIMAL(12,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. 사용자 주소 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS user_addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100), -- '집', '회사', '기타' 등
  recipient_name VARCHAR(200),
  phone VARCHAR(20),
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT '대한민국',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. 주문 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  order_number VARCHAR(50) UNIQUE,
  
  -- 금액 정보
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- 통화
  currency VARCHAR(3) DEFAULT 'KRW',
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
  
  -- 배송 정보
  shipping_address JSONB,
  billing_address JSONB,
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- 할인 정보
  coupon_code VARCHAR(50),
  coupon_discount DECIMAL(10,2) DEFAULT 0,
  
  -- 메모
  notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. 주문 아이템 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  
  -- 상품 정보 (주문 시점의 정보 저장)
  product_title VARCHAR(255),
  product_sku VARCHAR(100),
  product_image TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  
  -- 상품 옵션
  product_options JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. 결제 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  payment_method VARCHAR(50), -- stripe, paypal, bank_transfer
  transaction_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KRW',
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  
  -- 결제 제공자 응답 데이터
  provider_response JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 9. 쿠폰 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS coupons (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  
  -- 할인 정보
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed_amount, free_shipping
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2) DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  
  -- 사용 제한
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  usage_limit_per_user INTEGER DEFAULT 1,
  
  -- 유효 기간
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- 상태
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 10. 위시리스트 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- ========================================
-- 11. 상품 리뷰 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS product_reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- 리뷰 이미지
  images JSONB DEFAULT '[]',
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 12. 장바구니 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  selected_options JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- ========================================
-- 인덱스 생성
-- ========================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);

-- ========================================
-- RLS (Row Level Security) 정책 설정
-- ========================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own addresses" ON user_addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own reviews" ON product_reviews FOR ALL USING (auth.uid() = user_id);

-- 공개 데이터는 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view approved reviews" ON product_reviews FOR SELECT USING (status = 'approved');

-- ========================================
-- 함수들
-- ========================================
-- 주문 번호 자동 생성 함수
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::text, 6, '0');
  RETURN NEW;
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
-- 트리거들
-- ========================================
-- 주문 번호 자동 생성 트리거
CREATE TRIGGER set_order_number
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- updated_at 자동 업데이트 트리거들
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 