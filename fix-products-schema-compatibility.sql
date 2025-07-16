-- ================================================================
-- 홈페이지-DB 스키마 호환성 문제 해결 SQL
-- 에끌라린 쇼핑몰 - 2024.12.10
-- ================================================================

-- 1. 🚨 긴급: compare_price 컬럼 추가 (Admin 페이지 오류 해결)
-- 현재 original_price를 compare_price로 매핑하여 호환성 확보
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2) DEFAULT 0;

-- 2. 기존 original_price 데이터를 compare_price로 복사
UPDATE products 
SET compare_price = original_price 
WHERE original_price IS NOT NULL AND original_price > 0;

-- 3. rating_count 컬럼 추가 (review_count와 별도로)
-- 홈페이지에서 rating_count를 사용하지만 DB에는 review_count만 있음
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
UPDATE products 
SET rating_count = review_count 
WHERE review_count IS NOT NULL;

-- 4. 할인율 자동 계산을 위한 트리거 함수
CREATE OR REPLACE FUNCTION calculate_discount_percentage()
RETURNS TRIGGER AS $$
BEGIN
    -- compare_price가 있고 price보다 클 때만 할인율 계산
    IF NEW.compare_price > 0 AND NEW.price > 0 AND NEW.compare_price > NEW.price THEN
        NEW.discount_percentage = ROUND(((NEW.compare_price - NEW.price) / NEW.compare_price) * 100);
    ELSE
        NEW.discount_percentage = 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. 할인율 자동 계산 트리거 생성
DROP TRIGGER IF EXISTS update_discount_percentage ON products;
CREATE TRIGGER update_discount_percentage
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION calculate_discount_percentage();

-- 6. 기존 데이터에 대해 할인율 계산 적용
UPDATE products 
SET discount_percentage = CASE 
    WHEN compare_price > 0 AND price > 0 AND compare_price > price THEN
        ROUND(((compare_price - price) / compare_price) * 100)
    ELSE 0
END;

-- 7. 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_products_compare_price ON products(compare_price);
CREATE INDEX IF NOT EXISTS idx_products_rating_count ON products(rating_count);
CREATE INDEX IF NOT EXISTS idx_products_discount_percentage ON products(discount_percentage);

-- 8. 데이터 검증 쿼리 (실행 결과 확인용)
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN compare_price > 0 THEN 1 END) as products_with_compare_price,
    COUNT(CASE WHEN discount_percentage > 0 THEN 1 END) as products_with_discount,
    AVG(discount_percentage) as avg_discount_percentage
FROM products;

-- 9. 호환성 확인 쿼리 (샘플 데이터 확인)
SELECT 
    id,
    title,
    price,
    original_price,
    compare_price,
    discount_percentage,
    rating,
    review_count,
    rating_count,
    status
FROM products 
LIMIT 5;

-- 10. 필수 컬럼 존재 확인
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('compare_price', 'rating_count', 'discount_percentage')
ORDER BY column_name; 