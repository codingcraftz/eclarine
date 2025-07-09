# 🛍️ 에끌라린 쇼핑몰 데이터베이스 구조 (외부 API 호환)

## 📋 **개요**

- **프로젝트**: 에끌라린 (ECLARINE) 쥬얼리 전문 쇼핑몰
- **백엔드**: Supabase
- **호환성**: 기존 외부 API (`https://shofy-backend.vercel.app`) 100% 호환
- **기본키**: `_id` (TEXT, MongoDB ObjectId 문자열 형태)
- **관계 데이터**: JSON 객체 형태로 저장

---

## 🗂️ **테이블 구조**

### 1. **brands** (브랜드)

- **기본키**: `_id` (TEXT)
- **필드**:
  - `name` (TEXT): 브랜드명
  - `logo` (TEXT): 로고 이미지 URL
  - `email` (TEXT): 브랜드 이메일
  - `website` (TEXT): 웹사이트 URL
  - `location` (TEXT): 위치
  - `created_at`, `updated_at`: 생성/수정 시간

### 2. **categories** (카테고리)

- **기본키**: `_id` (TEXT)
- **필드**:
  - `name` (TEXT): 카테고리명
  - `slug` (TEXT): URL 슬러그 (유니크)
  - `description` (TEXT): 설명
  - `image` (TEXT): 카테고리 이미지 URL
  - `parent` (TEXT): 상위 카테고리 ID
  - `children` (JSONB): 하위 카테고리 ID 배열
  - `created_at`, `updated_at`: 생성/수정 시간

### 3. **products** (상품) ⭐ 핵심 테이블

- **기본키**: `_id` (TEXT)
- **필드**:
  - `sku` (TEXT): 상품 코드
  - `title` (TEXT): 상품명
  - `slug` (TEXT): URL 슬러그 (유니크)
  - `description` (TEXT): 상품 설명
  - `img` (TEXT): 대표 이미지 URL
  - `imageURLs` (JSONB): 갤러리 이미지 배열 `[{"color": "silver", "img": "url"}]`
  - `category` (JSONB): 카테고리 정보 `{"name": "All Silver", "id": "cat_silver_001"}`
  - `brand` (JSONB): 브랜드 정보 `{"name": "ECLARINE", "id": "brand_eclarine_001"}`
  - `price` (INTEGER): 현재 가격
  - `originalPrice` (INTEGER): 원래 가격
  - `quantity` (INTEGER): 재고 수량
  - `sold` (INTEGER): 판매 수량
  - `discount` (INTEGER): 할인율
  - `featured` (BOOLEAN): 추천 상품 여부
  - `status` (TEXT): 상품 상태 (in-stock, out-of-stock, discontinued)
  - `tags` (JSONB): 태그 배열 `["귀걸이", "실버", "진주"]`
  - `additionalInformation` (JSONB): 추가 정보 `[{"key": "소재", "value": "925 Sterling Silver"}]`
  - `reviews` (JSONB): 리뷰 ID 배열 `["review_001", "review_002"]`
  - `rating` (DECIMAL): 평점 (1.0-5.0)
  - `totalReviews` (INTEGER): 총 리뷰 수
  - `created_at`, `updated_at`: 생성/수정 시간

### 4. **user_profiles** (사용자 프로필)

- **기본키**: `_id` (TEXT)
- **필드**:
  - `name` (TEXT): 사용자명
  - `email` (TEXT): 이메일 (유니크)
  - `phone` (TEXT): 전화번호
  - `avatar` (TEXT): 프로필 이미지 URL
  - `role` (TEXT): 역할 (user, admin, staff)
  - `account_type` (TEXT): 계정 타입 (customer, admin, staff)
  - `date_of_birth` (DATE): 생년월일
  - `gender` (TEXT): 성별 (male, female, other)
  - `address` (TEXT): 주소
  - `city` (TEXT): 도시
  - `country` (TEXT): 국가
  - `zip_code` (TEXT): 우편번호
  - `bio` (TEXT): 자기소개
  - `website` (TEXT): 웹사이트
  - `is_active` (BOOLEAN): 활성화 상태
  - `email_verified` (BOOLEAN): 이메일 인증 상태
  - `phone_verified` (BOOLEAN): 전화번호 인증 상태
  - `created_at`, `updated_at`: 생성/수정 시간

### 5. **coupons** (쿠폰)

- **기본키**: `_id` (TEXT)
- **필드**:
  - `title` (TEXT): 쿠폰 제목
  - `coupon_code` (TEXT): 쿠폰 코드 (유니크)
  - `start_time` (TIMESTAMP): 시작 시간
  - `end_time` (TIMESTAMP): 종료 시간
  - `discount_percentage` (INTEGER): 할인율 (%)
  - `discount_amount` (INTEGER): 할인 금액 (원)
  - `minimum_amount` (INTEGER): 최소 주문 금액
  - `product_type` (TEXT): 적용 상품 타입 (All, All Silver, Gold 등)
  - `status` (TEXT): 상태 (active, inactive, expired)
  - `free_shipping` (BOOLEAN): 무료배송 여부
  - `created_at`, `updated_at`: 생성/수정 시간

### 6. **orders** (주문)

- **기본키**: `_id` (TEXT)
- **필드**:
  - `user_id` (TEXT): 사용자 ID
  - `order_number` (TEXT): 주문번호 (ECL + YYYYMMDD + 시퀀스)
  - `name` (TEXT): 주문자명
  - `email` (TEXT): 주문자 이메일
  - `phone` (TEXT): 주문자 전화번호
  - `address` (TEXT): 배송 주소
  - `city` (TEXT): 도시
  - `country` (TEXT): 국가
  - `zip_code` (TEXT): 우편번호
  - `cart` (JSONB): 주문 상품 배열
  - `discount` (INTEGER): 할인 금액
  - `total` (INTEGER): 총 금액
  - `delivery_charge` (INTEGER): 배송비
  - `status` (TEXT): 주문 상태 (pending, processing, shipped, delivered, cancelled)
  - `invoice` (TEXT): 송장 번호
  - `created_at`, `updated_at`: 생성/수정 시간

### 7. **order_items** (주문 상품)

- **기본키**: `_id` (TEXT)
- **필드**:
  - `order_id` (TEXT): 주문 ID
  - `product_id` (TEXT): 상품 ID
  - `quantity` (INTEGER): 수량
  - `price` (INTEGER): 단가
  - `created_at`: 생성 시간

### 8. **product_reviews** (상품 리뷰)

- **기본키**: `_id` (TEXT)
- **필드**:
  - `product_id` (TEXT): 상품 ID
  - `user_id` (TEXT): 사용자 ID
  - `rating` (INTEGER): 평점 (1-5)
  - `review` (TEXT): 리뷰 내용
  - `date` (TIMESTAMP): 리뷰 작성일
  - `status` (TEXT): 상태 (active, inactive, pending)
  - `created_at`, `updated_at`: 생성/수정 시간

### 9. **cart_items** (장바구니)

- **기본키**: `_id` (TEXT)
- **필드**:
  - `user_id` (TEXT): 사용자 ID
  - `product_id` (TEXT): 상품 ID
  - `quantity` (INTEGER): 수량
  - `created_at`, `updated_at`: 생성/수정 시간

### 10. **wishlist_items** (위시리스트)

- **기본키**: `_id` (TEXT)
- **필드**:
  - `user_id` (TEXT): 사용자 ID
  - `product_id` (TEXT): 상품 ID
  - `created_at`: 생성 시간

---

## 🗄️ **Storage Bucket 구조**

### 1. **product-images** (상품 이미지)

- **접근**: 공개 (Public)
- **용량 제한**: 10MB
- **폴더 구조**:
  ```
  product-images/
  ├── featured/           # 대표 이미지
  ├── gallery/            # 갤러리 이미지
  └── thumbnails/         # 썸네일 이미지
  ```

### 2. **category-images** (카테고리 이미지)

- **접근**: 공개 (Public)
- **용량 제한**: 5MB
- **폴더 구조**:
  ```
  category-images/
  ├── main/               # 메인 카테고리
  └── sub/                # 서브 카테고리
  ```

### 3. **brand-logos** (브랜드 로고)

- **접근**: 공개 (Public)
- **용량 제한**: 2MB
- **폴더 구조**:
  ```
  brand-logos/
  ├── main/               # 메인 로고
  └── variants/           # 로고 변형
  ```

### 4. **user-avatars** (사용자 아바타)

- **접근**: 비공개 (Private)
- **용량 제한**: 1MB
- **폴더 구조**:
  ```
  user-avatars/
  └── {user_id}/          # 사용자별 폴더
  ```

### 5. **review-images** (리뷰 이미지)

- **접근**: 공개 (Public)
- **용량 제한**: 5MB
- **폴더 구조**:
  ```
  review-images/
  └── {user_id}/          # 리뷰 작성자별 폴더
  ```

### 6. **temp-uploads** (임시 업로드)

- **접근**: 비공개 (Private)
- **용량 제한**: 20MB
- **폴더 구조**:
  ```
  temp-uploads/
  └── {user_id}/          # 임시 업로드 폴더
  ```

---

## 🚀 **설치 및 실행 가이드**

### **1단계: 데이터베이스 초기화**

```sql
-- 1. 기존 데이터 정리
\i src/sql/eclarine-database-schema-fix.sql

-- 2. 스키마 생성
\i src/sql/eclarine-database-schema.sql

-- 3. 샘플 데이터 삽입
\i src/sql/eclarine-sample-data.sql

-- 4. Storage 설정
\i src/sql/eclarine-storage-setup.sql
```

### **2단계: 이미지 업로드**

1. Supabase Storage에서 각 bucket 확인
2. 상품 이미지들을 적절한 폴더에 업로드
3. 샘플 데이터의 이미지 URL을 실제 Storage URL로 변경

### **3단계: 프론트엔드 연동**

1. Supabase 클라이언트 설정
2. 기존 외부 API 호출 코드를 Supabase API로 변경
3. 인증 시스템 연동 (Supabase Auth)

---

## 📊 **샘플 데이터**

### **생성된 데이터**

- **브랜드**: 1개 (ECLARINE)
- **카테고리**: 3개 (Jewelry, All Silver, Gold)
- **상품**: 5개 (에끌라린 쥬얼리 컬렉션)
- **사용자**: 1개 (관리자 계정)
- **쿠폰**: 5개 (다양한 할인 쿠폰)
- **리뷰**: 10개 (상품별 고객 리뷰)

### **실제 상품 목록**

1. **올실버 진주토끼 귀걸이** - ₩32,000
2. **올실버 십자가 목걸이** - ₩34,000
3. **블링블링 실버 체인 팔찌** - ₩96,000
4. **데이지 실버 딱붙 귀걸이** - ₩18,000
5. **올실버 하트 보석 귀걸이** - ₩33,000

---

## 🔄 **API 호환성 매핑**

### **기존 외부 API → Supabase**

```javascript
// 기존 API 호출
const products = await fetch("https://shofy-backend.vercel.app/api/product/all");

// Supabase 호출
const { data: products } = await supabase.from("products").select("*");
```

### **데이터 구조 호환성**

- ✅ **필드명**: 100% 호환 (`_id`, `img`, `imageURLs`, `category`, `brand` 등)
- ✅ **관계 데이터**: JSON 객체 형태로 동일하게 저장
- ✅ **리뷰 시스템**: 기존 구조와 동일
- ✅ **쿠폰 시스템**: 기존 구조와 동일

---

_📅 마지막 업데이트: 2024년 1월 (외부 API 호환 버전)_
