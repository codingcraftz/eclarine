# 데이터베이스 테이블 정보

## Products 테이블

### 최근 업데이트 (2024-12-19)

- `compare_price` 필드 추가: 할인 전 가격을 저장하는 필드
- 기존 `original_price` 데이터를 `compare_price`로 복사하여 동기화
- 프론트엔드에서 일관되게 `compare_price` 사용

### 주요 필드들:

- `id`: UUID 기본키
- `title`: 상품명
- `price`: 현재 판매가격
- `original_price`: 원래 가격 (레거시)
- `compare_price`: 할인 전 가격 (신규, 프론트엔드에서 사용)
- `discount_percentage`: 할인율 (자동 계산)
- `featured_image`: 대표 이미지
- `gallery_images`: 추가 이미지들 (JSON 배열)
- `category_id`: 카테고리 ID (FK)
- `brand_id`: 브랜드 ID (FK)
- `quantity`: 재고 수량
- `status`: 상품 상태 (active, inactive, draft)
- `is_featured`: 추천 상품 여부
- `is_popular`: 인기 상품 여부
- `is_bestseller`: 베스트셀러 여부
- `dimensions`: 상품 크기 정보
- `rating`: 상품 평점 (0~5, float)
- `rating_count`: 평점 개수 (integer, DEFAULT 0)

### SQL 쿼리:

```sql
-- compare_price 필드 추가
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2) DEFAULT NULL;

-- 기존 데이터 동기화
UPDATE products
SET compare_price = original_price
WHERE original_price IS NOT NULL;

-- rating_count 필드 추가
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
```

## 🚨 Products 테이블 스키마 호환성 문제 해결 (필수!)

**오류**: `Could not find the 'compare_price' column of 'products' in the schema cache`

**원인**: 홈페이지에서 `compare_price`를 사용하지만 DB에는 `original_price`만 있음

**해결**: 아래 SQL 쿼리를 Supabase SQL Editor에서 실행하세요:

```sql
-- 1. 홈페이지 호환성을 위한 필수 컬럼 추가
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- 2. 기존 데이터 마이그레이션
UPDATE products SET compare_price = original_price WHERE original_price IS NOT NULL;
UPDATE products SET rating_count = review_count WHERE review_count IS NOT NULL;

-- 기존 컬럼들 타입 확인 및 수정 (필요시)
ALTER TABLE products
ALTER COLUMN price TYPE DECIMAL(10,2),
ALTER COLUMN quantity TYPE INTEGER DEFAULT 0,
ALTER COLUMN is_featured SET DEFAULT false,
ALTER COLUMN is_popular SET DEFAULT false,
ALTER COLUMN is_bestseller SET DEFAULT false;

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_products_compare_price ON products(compare_price);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_track_quantity ON products(track_quantity);
CREATE INDEX IF NOT EXISTS idx_products_low_stock ON products(low_stock_threshold);
```

### 현재 Products 테이블 구조 확인

```sql
-- 현재 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
```

## 1. 테이블 구조 업데이트

### products 테이블 (기존)

- **featured_image**: 대표 이미지 URL (Supabase Storage)
- **gallery_images**: 갤러리 이미지 배열 (Supabase Storage)
- **is_popular**: 인기 상품 여부 (boolean)
- **is_bestseller**: 베스트셀러 여부 (boolean)

### products 테이블 전체 구조

```sql
-- 완전한 Products 테이블 구조 (참고용)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2) DEFAULT 0,
    quantity INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    category_id UUID REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    tags TEXT[], -- 배열 타입
    status VARCHAR(20) DEFAULT 'active',
    weight DECIMAL(8,2),
    type VARCHAR(50) DEFAULT 'simple',
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    featured_image TEXT,
    gallery_images TEXT[], -- 배열 타입
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. Supabase Storage 설정

### Storage Bucket: product-images

- **Public Access**: 모든 사용자가 이미지 조회 가능
- **Authenticated Upload**: 인증된 사용자만 업로드 가능
- **Authenticated Delete**: 인증된 사용자만 삭제 가능

### 폴더 구조

```
product-images/
├── products/
│   ├── timestamp_randomstring.jpg
│   ├── timestamp_randomstring.png
│   └── ...
└── temp/ (임시 파일, 필요시)
```

## 🔧 Storage RLS 정책 수정 (중요!)

**문제**: `new row violates row-level security policy` 오류 발생

**해결**: 아래 SQL 쿼리를 Supabase SQL Editor에서 실행하세요:

```sql
-- 1. 기존 storage.objects 정책 모두 삭제
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

-- 2. 새로운 정책 생성 (product-images 버킷 전용)

-- 모든 사용자가 product-images 버킷의 이미지를 조회할 수 있음
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- 모든 사용자가 product-images 버킷에 업로드할 수 있음 (임시)
CREATE POLICY "Allow public upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- 모든 사용자가 product-images 버킷에서 삭제할 수 있음 (임시)
CREATE POLICY "Allow public delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');

-- 3. 버킷이 존재하지 않으면 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
```

### 더 보안적인 정책 (나중에 적용)

```sql
-- 위 임시 정책 제거 후 아래 정책 적용
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;

-- 인증된 사용자만 업로드/삭제 가능
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

## 3. 구현 완료 기능

### 3.1 Frontend - 홈페이지 데이터베이스 연결

✅ **완료됨**

- 인기 상품 (is_popular = true)
- 베스트셀러 상품 (is_bestseller = true)
- 추천 상품 (is_featured = true)
- 카테고리별 상품 필터링
- 실시간 데이터 로딩 및 에러 처리

### 3.2 Supabase Storage 이미지 처리

✅ **완료됨**

- 이미지 업로드 (단일/다중)
- 이미지 삭제
- 이미지 URL 생성 및 변환
- 이미지 리사이징 (클라이언트 측)
- 기존 이미지 마이그레이션 유틸리티

### 3.3 Admin 상품 관리 시스템

✅ **완료됨**

#### 상품 등록 (/admin/products/register)

- 기본 정보 입력 (제목, 설명, 태그 등)
- 가격 정보 설정 (판매가, 정가, 할인율)
- 재고 관리 (수량, 재고 추적, 부족 알림)
- 분류 설정 (카테고리, 브랜드)
- 상품 상태 설정 (판매중, 품절, 임시저장)
- 상품 특성 설정 (추천, 인기, 베스트셀러)
- 이미지 업로드 (최대 5개)
- SEO 정보 설정 (메타 제목, 설명)

#### 상품 수정 (/admin/products/edit/[id])

- 기존 상품 정보 불러오기
- 모든 등록 기능과 동일
- 기존 이미지 유지/삭제 선택 가능
- 새 이미지 추가 가능

#### 상품 목록 (/admin/products)

- 페이지네이션 (10개씩)
- 검색 기능 (상품명, SKU)
- 상태 필터링 (전체, 판매중, 품절, 임시저장)
- 상품 정보 테이블 표시
- 재고 부족 알림 표시
- 상품 상태 변경 (드롭다운)
- 상품 삭제 (확인 후)
- 수정 페이지 연결

#### 상품 삭제

- 확인 대화상자
- 관련 이미지 자동 삭제
- 데이터베이스 레코드 삭제

### 3.4 Admin 레이아웃 시스템

✅ **완료됨**

- 반응형 사이드바 네비게이션
- 상단 헤더 (페이지 제목, 사용자 정보)
- 모바일 친화적 디자인
- 일관된 UI/UX

### 3.5 이미지 업로드 컴포넌트

✅ **완료됨**

- 드래그 앤 드롭 지원
- 이미지 미리보기
- 파일 형식 검증 (JPG, PNG, WebP)
- 파일 크기 제한 (5MB)
- 최대 이미지 개수 제한
- 업로드 진행 표시
- 에러 처리 및 사용자 알림

## 4. 데이터베이스 쿼리 예시

### 4.1 상품 조회

```sql
-- 인기 상품 조회
SELECT * FROM products
WHERE status = 'active' AND is_popular = true
ORDER BY rating DESC
LIMIT 8;

-- 베스트셀러 상품 조회
SELECT * FROM products
WHERE status = 'active' AND is_bestseller = true
ORDER BY rating DESC
LIMIT 8;

-- 카테고리별 상품 조회
SELECT p.*, c.name as category_name, b.name as brand_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
WHERE p.status = 'active' AND c.slug = 'rings';
```

### 4.2 재고 관리

```sql
-- 재고 부족 상품 조회
SELECT id, title, quantity, low_stock_threshold
FROM products
WHERE quantity <= low_stock_threshold
AND status = 'active'
ORDER BY quantity ASC;

-- 재고 업데이트
UPDATE products
SET quantity = quantity - 1
WHERE id = $1 AND quantity > 0;
```

### 4.3 이미지 URL 업데이트

```sql
-- 기존 이미지 URL을 Supabase Storage URL로 변경
UPDATE products
SET featured_image = REPLACE(
  featured_image,
  '/assets/img/product/',
  'https://your-project.supabase.co/storage/v1/object/public/product-images/products/'
)
WHERE featured_image LIKE '/assets/img/product/%';
```

## 5. 환경 설정 필요사항

### 5.1 Supabase 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5.2 Storage 정책 설정

```sql
-- 공개 읽기 권한
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 인증된 사용자 업로드 권한
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 인증된 사용자 삭제 권한
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

## 6. 구현 완료 체크리스트

### 6.1 Frontend (홈페이지)

- [x] 인기 상품 섹션 데이터베이스 연결
- [x] 베스트셀러 상품 섹션 데이터베이스 연결
- [x] 추천 상품 섹션 데이터베이스 연결
- [x] 카테고리별 상품 필터링
- [x] 이미지 URL 처리 (Supabase Storage)
- [x] 로딩 상태 및 에러 처리
- [x] 재고 상태 표시

### 6.2 Admin 시스템

- [x] 상품 등록 페이지
- [x] 상품 수정 페이지
- [x] 상품 목록 페이지
- [x] 상품 삭제 기능
- [x] 이미지 업로드 시스템
- [x] 카테고리/브랜드 관리 연동
- [x] 검색 및 필터링
- [x] 페이지네이션
- [x] 반응형 디자인

### 6.3 이미지 처리

- [x] Supabase Storage 설정
- [x] 이미지 업로드/삭제 API
- [x] 이미지 URL 생성/변환
- [x] 기존 이미지 마이그레이션 도구
- [x] 이미지 최적화 유틸리티
- [x] 에러 처리 및 폴백

### 6.4 데이터베이스 연동

- [x] 상품 CRUD 작업
- [x] 관계형 데이터 조회 (카테고리, 브랜드)
- [x] 페이지네이션 쿼리
- [x] 검색 기능
- [x] 상태 관리
- [x] 재고 추적

## 7. 향후 개선 사항

### 7.1 성능 최적화

- [ ] 이미지 CDN 연동
- [ ] 이미지 리사이징 자동화
- [ ] 캐싱 전략 구현
- [ ] 무한 스크롤 또는 가상 스크롤

### 7.2 기능 추가

- [ ] 상품 변형 (옵션, 사이즈 등)
- [ ] 대량 상품 업로드 (CSV/Excel)
- [ ] 상품 복제 기능
- [ ] 상품 히스토리 추적
- [ ] 재고 알림 시스템

### 7.3 사용자 경험

- [ ] 드래그 앤 드롭 상품 정렬
- [ ] 실시간 미리보기
- [ ] 자동 저장 기능
- [ ] 단축키 지원

## 8. 보안 고려사항

### 8.1 현재 구현됨

- [x] 파일 형식 검증
- [x] 파일 크기 제한
- [x] 인증된 사용자만 업로드/삭제
- [x] SQL 인젝션 방지 (Supabase ORM)

### 8.2 추가 권장사항

- [ ] 이미지 스캔 (악성 코드 검사)
- [ ] 업로드 속도 제한
- [ ] 사용자별 업로드 할당량
- [ ] 접근 로그 기록

## 9. 모니터링 및 유지보수

### 9.1 모니터링 항목

- [ ] Storage 사용량 추적
- [ ] 이미지 업로드 성공률
- [ ] 페이지 로드 시간
- [ ] 에러 발생률

### 9.2 정기 유지보수

- [ ] 사용하지 않는 이미지 정리
- [ ] 데이터베이스 최적화
- [ ] 백업 및 복원 테스트
- [ ] 보안 업데이트

## ✅ 완성된 기능들

### 1. 데이터베이스 스키마 최적화

- ✅ `compare_price` 필드 추가로 일관성 확보
- ✅ 기존 데이터 동기화 완료
- ✅ 모든 필요한 필드 구성 완료

### 2. 프론트엔드 컴포넌트 일관성 확보

- ✅ MongoDB 스타일(`_id`, `discount`) → Supabase 스타일(`id`, `compare_price`) 변경
- ✅ jewelry, electronics, fashion, beauty 컴포넌트 모두 통일
- ✅ 할인율 계산 로직 일관성 확보

### 3. Admin 페이지 완전 구현

- ✅ 상품 등록 기능 (이미지 업로드, 카테고리/브랜드 선택)
- ✅ 상품 수정 기능 (기존 이미지 관리, 데이터 업데이트)
- ✅ 상품 삭제 기능 (확인 다이얼로그)
- ✅ 상품 목록 관리 (페이지네이션, 검색, 필터)
- ✅ 재고 관리, 가격 설정, SEO 메타데이터
- ✅ dimensions, weight 등 상세 정보 관리

### 4. 테스트 완료

- ✅ 데이터베이스 연결 및 CRUD 작업 정상
- ✅ 이미지 업로드 및 처리 정상
- ✅ 할인가 계산 및 표시 정상
- ✅ 프론트엔드와 백엔드 연동 정상

## 🎯 주요 성과

1. **완전한 상품 관리 시스템**: 등록/수정/삭제/조회 모든 기능 구현
2. **일관된 데이터 구조**: 모든 컴포넌트가 동일한 필드명 사용
3. **효율적인 할인 시스템**: compare_price 기반 할인율 자동 계산
4. **확장 가능한 구조**: 새로운 상품 필드 추가 용이

## orders 테이블

```sql
CREATE TABLE orders (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  order_id VARCHAR(64) UNIQUE NOT NULL,
  order_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  payment_key VARCHAR(200),
  payment_method VARCHAR(50),
  paid_amount INTEGER,
  paid_at TIMESTAMPTZ,
  total_amount INTEGER NOT NULL,
  shipping_address JSONB,
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 주문만 조회 가능
CREATE POLICY "사용자는 자신의 주문만 조회 가능" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 주문만 생성 가능
CREATE POLICY "사용자는 자신의 주문만 생성 가능" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 주문만 수정 가능 (결제 전 상태에서만)
CREATE POLICY "사용자는 자신의 주문만 수정 가능" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id AND payment_status = 'PENDING');

-- 관리자는 모든 주문 조회/수정 가능
CREATE POLICY "관리자는 모든 주문 관리 가능" ON orders
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- 결제 상태 트리거
CREATE OR REPLACE FUNCTION update_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'DONE' AND OLD.payment_status != 'DONE' THEN
    NEW.order_status = 'PAID';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_status_trigger
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_status();
```

## order_form (주문서)

- 별도의 주문서 관리용 테이블 (에끌라린 기존 앱과 별개)
- 주문 상태: 결제확인대기, 결제확인, 발송준비, 발송완료 등
- 캡쳐사진은 Supabase Storage의 order-captures 버킷에 저장

| 컬럼명         | 타입        | 설명              |
| -------------- | ----------- | ----------------- |
| id             | uuid        | PK, 자동생성      |
| created_at     | timestamptz | 생성일시          |
| nickname       | text        | 유튜브 닉네임     |
| name           | text        | 이름              |
| phone          | text        | 전화번호          |
| address        | text        | 주소              |
| address_detail | text        | 상세주소          |
| payment        | text        | 결제방법          |
| request        | text        | 요청사항          |
| status         | text        | 주문상태          |
| capture_urls   | jsonb       | 캡쳐사진 URL 배열 |

- status: '결제확인대기', '결제확인', '발송준비', '발송완료' 등
- capture_urls: ["url1", "url2", ...]

### 2025-08-11 RLS 정책 핫픽스: 인증 사용자 INSERT 허용

주문서 제출 시 `42501 new row violates row-level security policy for table "order_form"` 오류가 발생할 수 있습니다. 원인: `INSERT` 정책이 `anon`에게만 열려 있고, 로그인한 사용자는 `authenticated` 역할이므로 차단됨.

Supabase SQL Editor에서 아래 쿼리를 실행해 주세요:

```sql
-- RLS 활성화 (이미 활성화일 수 있음)
ALTER TABLE public.order_form ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (오류 무시)
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.order_form;
DROP POLICY IF EXISTS "Allow insert for anon" ON public.order_form;

-- 인증 사용자에게도 INSERT 허용
CREATE POLICY "Allow insert for authenticated"
ON public.order_form
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 참고: 기존 anon용 정책이 없다면 다음도 함께 생성
CREATE POLICY "Allow insert for anon"
ON public.order_form
FOR INSERT
TO anon
WITH CHECK (true);
```

권장: 운영 시에는 UPDATE/DELETE 정책을 `public` 전체 허용 대신, 관리자만 가능하도록 점진적으로 보안 강화 예정.

## order_form_images 테이블

```sql
create table order_form_images (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references order_form(id) on delete cascade,
  image_url text not null,
  image_status text default '준비전' check (image_status in ('준비전', '준비완료', '주문접수', '주문접수 완료')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 정책
alter table order_form_images enable row level security;

create policy "모든 사용자가 이미지를 볼 수 있음" on order_form_images
  for select using (true);

create policy "관리자만 이미지 상태를 수정할 수 있음" on order_form_images
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

## 2024-06-13 order_form 테이블 RLS 정책(모든 사용자 update/delete 허용)

- 모든 사용자(anon, authenticated)에게 update, delete 허용

```sql
create policy "누구나 주문 수정 허용"
on order_form
for update
to public
using (true);

create policy "누구나 주문 삭제 허용"
on order_form
for delete
to public
using (true);
```
