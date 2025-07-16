-- ========================================
-- 에끌라린 데이터베이스 - 모든 테이블 삭제
-- ========================================
-- 주의: 이 스크립트는 모든 데이터를 삭제합니다!
-- 실행 전에 백업을 확인하세요.

-- 1단계: 모든 정책(Policy) 삭제
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Users can manage own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
DROP POLICY IF EXISTS "Anyone can view active brands" ON brands;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON product_reviews;
DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;

-- 2단계: 모든 트리거 삭제
DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON product_reviews;
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
DROP TRIGGER IF EXISTS set_order_number ON orders;

-- 3단계: 모든 함수 삭제
DROP FUNCTION IF EXISTS generate_order_number();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS set_order_number_trigger();

-- 4단계: 모든 뷰 삭제 (있다면)
DROP VIEW IF EXISTS product_details_view;
DROP VIEW IF EXISTS order_summary_view;

-- 5단계: 모든 테이블 삭제 (의존성 순서 고려)
-- 자식 테이블부터 삭제
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- 6단계: 기존 데이터 타입 삭제 (사용자 정의 타입이 있다면)
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS product_status CASCADE;
DROP TYPE IF EXISTS coupon_type CASCADE;

-- 7단계: 시퀀스 삭제 (자동 생성된 것들)
DROP SEQUENCE IF EXISTS brands_id_seq CASCADE;
DROP SEQUENCE IF EXISTS categories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS products_id_seq CASCADE;
DROP SEQUENCE IF EXISTS orders_id_seq CASCADE;
DROP SEQUENCE IF EXISTS order_items_id_seq CASCADE;
DROP SEQUENCE IF EXISTS cart_items_id_seq CASCADE;
DROP SEQUENCE IF EXISTS wishlist_items_id_seq CASCADE;
DROP SEQUENCE IF EXISTS product_reviews_id_seq CASCADE;
DROP SEQUENCE IF EXISTS coupons_id_seq CASCADE;

-- 8단계: 모든 인덱스 삭제 (테이블 삭제 시 자동 삭제되지만 명시적 삭제)
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_brand;
DROP INDEX IF EXISTS idx_products_status;
DROP INDEX IF EXISTS idx_products_featured;
DROP INDEX IF EXISTS idx_orders_user;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_order_items_order;
DROP INDEX IF EXISTS idx_cart_items_user;
DROP INDEX IF EXISTS idx_wishlist_items_user;
DROP INDEX IF EXISTS idx_reviews_product;

-- 9단계: 기존 MongoDB 스타일 테이블들도 삭제 (혹시 있다면)
DROP TABLE IF EXISTS _products CASCADE;
DROP TABLE IF EXISTS _categories CASCADE;
DROP TABLE IF EXISTS _brands CASCADE;
DROP TABLE IF EXISTS _orders CASCADE;
DROP TABLE IF EXISTS _users CASCADE;
DROP TABLE IF EXISTS _user_profiles CASCADE;
DROP TABLE IF EXISTS _coupons CASCADE;

-- 10단계: 기타 가능한 테이블들
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS shipping_addresses CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '🗑️  모든 테이블이 삭제되었습니다!';
    RAISE NOTICE '📋 삭제된 항목:';
    RAISE NOTICE '   - 모든 테이블 (brands, categories, products, orders, 등)';
    RAISE NOTICE '   - 모든 트리거 및 함수';
    RAISE NOTICE '   - 모든 RLS 정책';
    RAISE NOTICE '   - 모든 인덱스 및 시퀀스';
    RAISE NOTICE '';
    RAISE NOTICE '✅ 데이터베이스가 깨끗하게 초기화되었습니다.';
    RAISE NOTICE '💡 다음 단계: reset-and-create-clean-database.sql 실행';
END $$; 