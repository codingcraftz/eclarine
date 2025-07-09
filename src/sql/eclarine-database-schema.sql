-- ================================================================
-- 에끌라린 쇼핑몰 데이터베이스 스키마 (외부 API 호환)
-- 기존 shofy-backend API와 100% 호환되도록 설계
-- ================================================================

-- Extensions 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- 1. 브랜드 테이블 (외부 API 호환)
-- ================================================================
CREATE TABLE brands (
    _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    logo TEXT,
    name TEXT NOT NULL,
    email TEXT,
    website TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 2. 카테고리 테이블 (외부 API 호환)
-- ================================================================
CREATE TABLE categories (
    _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    img TEXT,
    parent TEXT NOT NULL,
    children JSONB DEFAULT '[]'::JSONB, -- 문자열 배열
    product_type TEXT NOT NULL CHECK (product_type IN ('electronics', 'fashion', 'beauty', 'jewelry')),
    status TEXT DEFAULT 'Show',
    __v INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 3. 상품 테이블 (외부 API 완전 호환)
-- ================================================================
CREATE TABLE products (
    _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    sku TEXT UNIQUE NOT NULL,
    img TEXT NOT NULL, -- 대표 이미지
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    unit TEXT, -- "3pcs", "5pcs" 등
    price NUMERIC(10,2) NOT NULL,
    discount INTEGER DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'in-stock' CHECK (status IN ('in-stock', 'out-of-stock')),
    
    -- 관계 데이터 (객체 형태로 저장)
    brand JSONB NOT NULL, -- {name: string, id: string}
    category JSONB NOT NULL, -- {name: string, id: string}
    
    -- 이미지 갤러리
    image_urls JSONB DEFAULT '[]'::JSONB, -- [{color: {name, clrCode}, img, sizes, _id}]
    
    -- 카테고리 구조
    parent TEXT, -- 상위 카테고리
    children TEXT, -- 하위 카테고리
    
    product_type TEXT NOT NULL CHECK (product_type IN ('electronics', 'fashion', 'beauty', 'jewelry')),
    description TEXT,
    additional_information JSONB DEFAULT '[]'::JSONB, -- [{key, value}]
    tags JSONB DEFAULT '[]'::JSONB, -- 문자열 배열
    sizes JSONB DEFAULT '[]'::JSONB, -- 사이즈 배열
    featured BOOLEAN DEFAULT FALSE,
    sell_count INTEGER DEFAULT 0,
    
    -- 특별 할인 정보
    offer_date JSONB, -- {startDate: ISO, endDate: ISO}
    video_id TEXT, -- YouTube 비디오 ID
    
    __v INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 4. 사용자 프로필 테이블 (Supabase Auth 확장)
-- ================================================================
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    _id TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
    name TEXT,
    email TEXT,
    image TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
    phone TEXT,
    address JSONB, -- {street, city, state, zipCode, country}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 5. 상품 리뷰 테이블
-- ================================================================
CREATE TABLE product_reviews (
    _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(_id) ON DELETE CASCADE,
    rating NUMERIC(2,1) CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    __v INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 6. 쿠폰 테이블
-- ================================================================
CREATE TABLE coupons (
    _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    logo TEXT,
    discount_percentage INTEGER,
    discount_amount NUMERIC(10,2),
    minimum_amount NUMERIC(10,2) DEFAULT 0,
    product_type TEXT CHECK (product_type IN ('electronics', 'fashion', 'beauty', 'jewelry')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 7. 주문 테이블
-- ================================================================
CREATE TABLE orders (
    _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- 주문 정보
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address JSONB NOT NULL, -- {street, city, state, zipCode, country}
    
    -- 결제 정보
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    -- 주문 상태
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    
    -- 금액 정보
    subtotal NUMERIC(10,2) NOT NULL,
    discount NUMERIC(10,2) DEFAULT 0,
    shipping_cost NUMERIC(10,2) DEFAULT 0,
    tax NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    
    -- 쿠폰 정보
    coupon_info JSONB, -- {code, discount}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 8. 주문 상품 테이블
-- ================================================================
CREATE TABLE order_items (
    _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    order_id TEXT REFERENCES orders(_id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(_id) ON DELETE SET NULL,
    
    -- 주문 당시 상품 정보 (스냅샷)
    title TEXT NOT NULL,
    img TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    
    -- 선택 옵션
    selected_color JSONB, -- {name, clrCode}
    selected_size TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 9. 장바구니 테이블
-- ================================================================
CREATE TABLE cart_items (
    _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    selected_color JSONB, -- {name, clrCode}
    selected_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, product_id, selected_color, selected_size)
);

-- ================================================================
-- 10. 위시리스트 테이블
-- ================================================================
CREATE TABLE wishlist_items (
    _id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, product_id)
);

-- ================================================================
-- 인덱스 생성
-- ================================================================

-- 브랜드
CREATE INDEX idx_brands_name ON brands(name);

-- 카테고리
CREATE INDEX idx_categories_parent ON categories(parent);
CREATE INDEX idx_categories_product_type ON categories(product_type);

-- 상품
CREATE INDEX idx_products_title ON products(title);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_product_type ON products(product_type);
CREATE INDEX idx_products_parent ON products(parent);
CREATE INDEX idx_products_children ON products(children);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_brand_gin ON products USING GIN(brand);
CREATE INDEX idx_products_category_gin ON products USING GIN(category);
CREATE INDEX idx_products_tags_gin ON products USING GIN(tags);

-- 리뷰
CREATE INDEX idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_reviews_rating ON product_reviews(rating);

-- 주문
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- 주문 상품
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 장바구니
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- 위시리스트
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);

-- ================================================================
-- 자동 업데이트 트리거
-- ================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 주문번호 생성 함수
-- ================================================================
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

-- ================================================================
-- RLS (Row Level Security) 정책
-- ================================================================

-- 모든 테이블에 RLS 활성화
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- 공개 테이블 정책 (모든 사용자 조회 가능)
CREATE POLICY "공개 조회 - 브랜드" ON brands FOR SELECT USING (true);
CREATE POLICY "공개 조회 - 카테고리" ON categories FOR SELECT USING (true);
CREATE POLICY "공개 조회 - 상품" ON products FOR SELECT USING (true);
CREATE POLICY "공개 조회 - 리뷰" ON product_reviews FOR SELECT USING (true);
CREATE POLICY "공개 조회 - 쿠폰" ON coupons FOR SELECT USING (true);

-- 사용자 프로필 정책
CREATE POLICY "사용자 프로필 조회" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "사용자 프로필 삽입" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "사용자 프로필 수정" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- 리뷰 작성 정책
CREATE POLICY "리뷰 작성" ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "리뷰 수정" ON product_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "리뷰 삭제" ON product_reviews FOR DELETE USING (auth.uid() = user_id);

-- 장바구니 정책
CREATE POLICY "장바구니 조회" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "장바구니 삽입" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "장바구니 수정" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "장바구니 삭제" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- 위시리스트 정책
CREATE POLICY "위시리스트 조회" ON wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "위시리스트 삽입" ON wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "위시리스트 삭제" ON wishlist_items FOR DELETE USING (auth.uid() = user_id);

-- 주문 정책
CREATE POLICY "주문 조회" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "주문 삽입" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 주문 상품 정책
CREATE POLICY "주문 상품 조회" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders._id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- 관리자 정책
CREATE POLICY "관리자 모든 권한 - 브랜드" ON brands FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

CREATE POLICY "관리자 모든 권한 - 카테고리" ON categories FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

CREATE POLICY "관리자 모든 권한 - 상품" ON products FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

CREATE POLICY "관리자 모든 권한 - 쿠폰" ON coupons FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

CREATE POLICY "관리자 모든 권한 - 주문" ON orders FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.role = 'admin'
    )
);

-- ================================================================
-- 유용한 뷰 생성
-- ================================================================

-- 상품 상세 뷰 (리뷰 통계 포함)
CREATE VIEW products_with_reviews AS
SELECT 
    p.*,
    COALESCE(r.review_count, 0) as review_count,
    COALESCE(r.average_rating, 0) as average_rating
FROM products p
LEFT JOIN (
    SELECT 
        product_id,
        COUNT(*) as review_count,
        ROUND(AVG(rating), 1) as average_rating
    FROM product_reviews 
    GROUP BY product_id
) r ON p._id = r.product_id;

-- 사용자 주문 요약 뷰
CREATE VIEW user_order_summary AS
SELECT 
    o.user_id,
    COUNT(*) as total_orders,
    SUM(o.total) as total_spent,
    MAX(o.created_at) as last_order_date
FROM orders o
GROUP BY o.user_id;

COMMENT ON TABLE brands IS '브랜드 정보 테이블 (외부 API 호환)';
COMMENT ON TABLE categories IS '카테고리 정보 테이블 (외부 API 호환)';
COMMENT ON TABLE products IS '상품 정보 테이블 (외부 API 완전 호환)';
COMMENT ON TABLE user_profiles IS 'Supabase Auth 확장 사용자 프로필';
COMMENT ON TABLE product_reviews IS '상품 리뷰 테이블';
COMMENT ON TABLE coupons IS '할인 쿠폰 테이블';
COMMENT ON TABLE orders IS '주문 정보 테이블';
COMMENT ON TABLE order_items IS '주문 상품 상세 테이블';
COMMENT ON TABLE cart_items IS '장바구니 테이블';
COMMENT ON TABLE wishlist_items IS '위시리스트 테이블'; 