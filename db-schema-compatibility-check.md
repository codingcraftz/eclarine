# 홈페이지-DB 스키마 호환성 분석

## 📊 현재 상태 요약

### ✅ **정상 작동 중**

- 홈페이지 기본 데이터 로딩 (상품, 카테고리, 브랜드)
- 인기 상품, 베스트셀러, 전체 상품 표시
- 카테고리별 필터링
- 장바구니, 위시리스트, 비교 기능

### ⚠️ **호환성 문제**

#### 1. **컬럼명 불일치**

| 홈페이지 예상   | 현재 DB          | 상태    | 해결 방법             |
| --------------- | ---------------- | ------- | --------------------- |
| `compare_price` | `original_price` | ❌ 오류 | 컬럼명 변경 필요      |
| `rating_count`  | `review_count`   | ❌ 오류 | 컬럼명 변경 또는 매핑 |

#### 2. **누락된 컬럼**

```sql
-- 홈페이지에서 사용하지만 DB에 없는 컬럼들
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2);
```

#### 3. **타입 불일치**

- `tags`: 현재 배열 타입 ✅ (정상)
- `gallery_images`: 현재 배열 타입 ✅ (정상)
- `attributes`: 현재 JSONB 타입 ✅ (정상)

## 🔧 해결책

### 1. **즉시 수정 필요 (Critical)**

```sql
-- 1. compare_price 컬럼 추가
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2) DEFAULT 0;

-- 2. 기존 original_price 데이터를 compare_price로 복사
UPDATE products SET compare_price = original_price WHERE original_price IS NOT NULL;

-- 3. rating_count 컬럼 추가 (review_count와 별도로)
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
UPDATE products SET rating_count = review_count WHERE review_count IS NOT NULL;
```

### 2. **권장 사항**

```sql
-- 할인율 자동 계산을 위한 트리거
CREATE OR REPLACE FUNCTION calculate_discount_percentage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.compare_price > 0 AND NEW.price > 0 THEN
        NEW.discount_percentage = ROUND(((NEW.compare_price - NEW.price) / NEW.compare_price) * 100);
    ELSE
        NEW.discount_percentage = 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_discount_percentage
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION calculate_discount_percentage();
```

## 📋 검증 체크리스트

### ✅ **홈페이지 정상 작동 확인**

- [x] 상품 목록 표시
- [x] 카테고리 필터링
- [x] 장바구니/위시리스트 기능
- [x] 이미지 로딩

### ❌ **Admin 페이지 오류 해결 필요**

- [ ] `compare_price` 컬럼 추가
- [ ] 상품 등록/수정 기능 복구
- [ ] 할인율 계산 로직 수정

## 🚀 마이그레이션 우선순위

1. **긴급 (P0)**: `compare_price` 컬럼 추가
2. **중요 (P1)**: `rating_count` 컬럼 추가
3. **개선 (P2)**: 할인율 자동 계산 트리거
4. **최적화 (P3)**: 데이터 검증 및 정리

## 🔗 관련 파일들

### 수정 필요

- `src/components/products/jewelry/product-item.jsx` (line 37-39)
- `src/pages/admin/products/register.jsx`
- `src/pages/admin/products/edit/[id].jsx`

### 정상 작동

- `src/lib/supabase.js` (supabaseService)
- `src/components/products/jewelry/popular-products.jsx`
- `src/components/products/jewelry/best-seller-prd.jsx`
- `src/components/products/jewelry/product-area.jsx`
