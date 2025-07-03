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
-- 3. 상품 태그 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS product_tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#007bff', -- 태그 색상 (HEX)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. 상품 테이블 (확장된 버전)
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
  allow_backorder BOOLEAN DEFAULT false,
  
  -- 물리적 속성
  weight DECIMAL(8,2),
  length DECIMAL(8,2),
  width DECIMAL(8,2),
  height DECIMAL(8,2),
  
  -- 상품 메타데이터
  type VARCHAR(50) DEFAULT 'simple', -- simple, variable, grouped, digital
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, draft, archived
  visibility VARCHAR(20) DEFAULT 'public', -- public, private, password
  
  -- 이미지 및 미디어
  featured_image TEXT,
  gallery_images JSONB DEFAULT '[]',
  video_url TEXT,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  focus_keyword VARCHAR(100),
  
  -- 특별 플래그들
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  is_digital BOOLEAN DEFAULT false,
  is_downloadable BOOLEAN DEFAULT false,
  
  -- 관계
  category_id BIGINT REFERENCES categories(id),
  brand_id BIGINT REFERENCES brands(id),
  
  -- 평점 (캐시용)
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- 판매 통계 (캐시용)
  sales_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- 추가 속성 (JSON으로 저장 - 색상, 사이즈 등)
  attributes JSONB DEFAULT '{}',
  variations JSONB DEFAULT '[]', -- 상품 변형 (색상별, 사이즈별 가격/재고)
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. 상품-태그 연결 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS product_tag_relations (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES product_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(product_id, tag_id)
);

-- ========================================
-- 6. 사용자 프로필 테이블 (확장된 버전)
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
  
  -- 기본 주소
  default_address_id BIGINT,
  
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
-- 7. 사용자 주소 테이블
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
-- 8. 배송 방법 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS shipping_methods (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(8,2) NOT NULL,
  free_shipping_threshold DECIMAL(10,2), -- 무료배송 기준 금액
  estimated_delivery_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 9. 주문 테이블 (확장된 버전)
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
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled, refunded
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, partial, refunded
  fulfillment_status VARCHAR(20) DEFAULT 'unfulfilled', -- unfulfilled, partial, fulfilled
  
  -- 배송 정보
  shipping_address JSONB,
  billing_address JSONB,
  shipping_method_id BIGINT REFERENCES shipping_methods(id),
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- 할인 정보
  coupon_code VARCHAR(50),
  coupon_discount DECIMAL(10,2) DEFAULT 0,
  
  -- 메모 및 추가 정보
  notes TEXT,
  admin_notes TEXT,
  
  -- 이메일 발송 기록
  confirmation_email_sent BOOLEAN DEFAULT false,
  shipping_email_sent BOOLEAN DEFAULT false,
  delivery_email_sent BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 10. 주문 아이템 테이블 (확장된 버전)
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
  
  -- 상품 옵션 (색상, 사이즈 등)
  product_options JSONB DEFAULT '{}',
  variation_id BIGINT,
  
  -- 리뷰 작성 여부
  is_reviewed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 11. 결제 테이블 (확장된 버전)
-- ========================================
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  payment_method VARCHAR(50), -- stripe, paypal, bank_transfer, cash_on_delivery
  gateway VARCHAR(50), -- stripe, toss, kakaopay, naverpay
  transaction_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KRW',
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, cancelled, refunded
  
  -- 환불 정보
  refunded_amount DECIMAL(10,2) DEFAULT 0,
  refund_reason TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  -- 결제 제공자 응답 데이터
  provider_response JSONB DEFAULT '{}',
  
  -- 결제 메타데이터
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 12. 쿠폰 테이블 (확장된 버전)
-- ========================================
CREATE TABLE IF NOT EXISTS coupons (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  
  -- 할인 정보
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed_amount, free_shipping, buy_x_get_y
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2) DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  
  -- 사용 제한
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  usage_limit_per_user INTEGER DEFAULT 1,
  
  -- 조건
  applicable_categories JSONB DEFAULT '[]', -- 적용 가능 카테고리 ID
  applicable_products JSONB DEFAULT '[]', -- 적용 가능 상품 ID
  exclude_sale_items BOOLEAN DEFAULT false,
  minimum_quantity INTEGER DEFAULT 1,
  
  -- 유효 기간
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- 상태
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 13. 쿠폰 사용 기록 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS coupon_usages (
  id BIGSERIAL PRIMARY KEY,
  coupon_id BIGINT REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  order_id BIGINT REFERENCES orders(id),
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 14. 위시리스트 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- ========================================
-- 15. 상품 리뷰 테이블 (확장된 버전)
-- ========================================
CREATE TABLE IF NOT EXISTS product_reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id),
  order_item_id BIGINT REFERENCES order_items(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- 리뷰 이미지
  images JSONB DEFAULT '[]',
  
  -- 도움이 됨 투표
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  
  -- 관리자 응답
  admin_reply TEXT,
  admin_reply_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 16. 리뷰 도움됨 투표 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS review_votes (
  id BIGSERIAL PRIMARY KEY,
  review_id BIGINT REFERENCES product_reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL, -- true: 도움됨, false: 도움안됨
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(review_id, user_id)
);

-- ========================================
-- 17. 장바구니 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  variation_id BIGINT,
  selected_options JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id, variation_id)
);

-- ========================================
-- 18. 최근 본 상품 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS recently_viewed (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- ========================================
-- 19. 상품 문의 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS product_inquiries (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending', -- pending, answered, closed
  admin_reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 20. 재입고 알림 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS stock_notifications (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  is_notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(product_id, user_id)
);

-- ========================================
-- 21. 뉴스레터 구독 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- 22. 사이트 설정 테이블
-- ========================================
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
  group_name VARCHAR(50),
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 인덱스 생성
-- ========================================
-- 기본 인덱스들
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_popular ON products(is_popular);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at);

-- 주문 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- 사용자 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_user_addresses_user ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_default ON user_addresses(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user ON recently_viewed(user_id);

-- 리뷰 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON product_reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(rating);

-- 쿠폰 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON coupon_usages(user_id);

-- 텍스트 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN (to_tsvector('korean', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_categories_search ON categories USING GIN (to_tsvector('korean', name || ' ' || COALESCE(description, '')));

-- ========================================
-- RLS (Row Level Security) 정책 설정
-- ========================================
-- 사용자 관련 테이블에 RLS 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- 사용자 프로필 정책
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = id);

-- 사용자 주소 정책
CREATE POLICY "Users can manage own addresses" ON user_addresses FOR ALL USING (auth.uid() = user_id);

-- 주문 정책
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 주문 아이템 정책
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM orders WHERE orders.id = order_items.order_id)
);

-- 장바구니 정책
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- 위시리스트 정책
CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- 최근 본 상품 정책
CREATE POLICY "Users can manage own recently viewed" ON recently_viewed FOR ALL USING (auth.uid() = user_id);

-- 리뷰 정책
CREATE POLICY "Users can view approved reviews" ON product_reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can manage own reviews" ON product_reviews FOR ALL USING (auth.uid() = user_id);

-- 공개 데이터 정책
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view shipping methods" ON shipping_methods FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view product tags" ON product_tags FOR SELECT USING (true);

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

-- 상품 평점 업데이트 함수
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(3,2);
  review_count INTEGER;
BEGIN
  SELECT 
    ROUND(AVG(rating)::numeric, 2),
    COUNT(*)
  INTO avg_rating, review_count
  FROM product_reviews 
  WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) 
    AND status = 'approved';
  
  UPDATE products 
  SET 
    average_rating = COALESCE(avg_rating, 0),
    review_count = review_count
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 쿠폰 사용 카운트 업데이트 함수
CREATE OR REPLACE FUNCTION update_coupon_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE coupons 
  SET used_count = used_count + 1 
  WHERE id = NEW.coupon_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 사용자 통계 업데이트 함수
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    UPDATE user_profiles 
    SET 
      total_spent = total_spent + NEW.total_amount,
      total_orders = total_orders + 1
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 트리거들
-- ========================================

-- updated_at 자동 업데이트 트리거들
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 주문 번호 자동 생성 트리거
CREATE TRIGGER set_order_number
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- 상품 평점 업데이트 트리거
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- 쿠폰 사용 카운트 업데이트 트리거
CREATE TRIGGER update_coupon_usage_trigger
  AFTER INSERT ON coupon_usages
  FOR EACH ROW
  EXECUTE FUNCTION update_coupon_usage_count();

-- 사용자 통계 업데이트 트리거
CREATE TRIGGER update_user_stats_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- ========================================
-- 기본 사이트 설정 데이터
-- ========================================
INSERT INTO site_settings (key, value, type, group_name, description) VALUES
('site_name', '이클라린 쇼핑몰', 'string', 'general', '사이트 이름'),
('site_description', '최고의 쇼핑 경험을 제공합니다', 'string', 'general', '사이트 설명'),
('currency', 'KRW', 'string', 'general', '기본 통화'),
('tax_rate', '10', 'number', 'general', '세율 (%)'),
('free_shipping_threshold', '50000', 'number', 'shipping', '무료배송 기준 금액'),
('default_shipping_cost', '3000', 'number', 'shipping', '기본 배송비'),
('order_auto_confirm_days', '7', 'number', 'order', '주문 자동 확정 일수'),
('review_auto_approve', 'false', 'boolean', 'review', '리뷰 자동 승인 여부'),
('max_review_images', '5', 'number', 'review', '리뷰 최대 이미지 수'),
('stock_warning_threshold', '10', 'number', 'inventory', '재고 부족 경고 기준'),
('contact_email', 'contact@eclarine.com', 'string', 'contact', '고객센터 이메일'),
('contact_phone', '1588-0000', 'string', 'contact', '고객센터 전화번호'),
('business_hours', '09:00-18:00 (월-금)', 'string', 'contact', '영업시간'),
('return_policy_days', '14', 'number', 'policy', '반품 가능 일수'),
('exchange_policy_days', '14', 'number', 'policy', '교환 가능 일수')
ON CONFLICT (key) DO NOTHING;

-- ========================================
-- 기본 배송 방법 데이터
-- ========================================
INSERT INTO shipping_methods (name, description, price, free_shipping_threshold, estimated_delivery_days) VALUES
('일반배송', '3-5일 내 배송', 3000, 50000, 4),
('당일배송', '오후 6시 이전 주문시 당일 배송 (서울/경기 한정)', 8000, 100000, 1),
('택배배송', '전국 택배 배송', 3500, 50000, 3),
('매장픽업', '매장에서 직접 수령', 0, 0, 1)
ON CONFLICT DO NOTHING; 