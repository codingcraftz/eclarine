-- ================================================================
-- 에끌라린 쇼핑몰 데이터베이스 스키마 오류 수정
-- 기존 함수 충돌 해결
-- ================================================================

-- 1. 기존 함수들 삭제 (존재하는 경우)
DROP FUNCTION IF EXISTS generate_order_number();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 2. 기존 테이블들 삭제 (존재하는 경우) - 순서 중요
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 3. 시퀀스 삭제 (존재하는 경우)
DROP SEQUENCE IF EXISTS order_number_seq;

-- ================================================================
-- 이제 원래 스키마를 다시 실행하세요
-- ================================================================ 