# Supabase Storage 설정 가이드

## 1. Storage Bucket 생성

Supabase 대시보드에서 다음 Storage Bucket을 생성해야 합니다:

### product-images 버킷 생성

```sql
-- Storage bucket 생성
INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES ('product-images', 'product-images', true, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
```

### 또는 Supabase Dashboard에서 직접 생성:

1. Storage 메뉴로 이동
2. "New bucket" 클릭
3. 버킷 이름: `product-images`
4. Public bucket: `체크`
5. Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

## 2. Storage 정책 (RLS) 설정

### 공개 읽기 정책

```sql
-- 모든 사용자가 이미지를 볼 수 있도록 허용
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

### 관리자 업로드 정책

```sql
-- 관리자만 이미지 업로드 가능
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

### 관리자 삭제 정책

```sql
-- 관리자만 이미지 삭제 가능
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

## 3. 환경 변수 설정

`.env.local` 파일에 다음 변수들이 설정되어 있는지 확인하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. 이미지 업로드 테스트

관리자 페이지에서 상품 등록 시 이미지 업로드가 정상적으로 작동하는지 확인하세요.

### 업로드 가능한 파일 형식:

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### 파일 크기 제한:

- 최대 5MB per 파일
- 최대 5개 이미지 per 상품

## 5. 폴더 구조

업로드된 이미지들은 다음과 같은 구조로 저장됩니다:

```
product-images/
├── products/
│   ├── 1609459200000_abc123.jpg
│   ├── 1609459200000_def456.png
│   └── ...
└── temp/
    ├── temp_files (필요시)
    └── ...
```

## 6. 기존 이미지 마이그레이션

기존 정적 이미지들을 Supabase Storage로 마이그레이션하려면:

1. 기존 이미지 파일들을 수집
2. 각 이미지를 Supabase Storage에 업로드
3. 데이터베이스의 이미지 URL 업데이트

```sql
-- 예시: 기존 이미지 URL 업데이트
UPDATE products
SET featured_image = REPLACE(featured_image, '/assets/img/product/', 'https://your-project.supabase.co/storage/v1/object/public/product-images/products/')
WHERE featured_image LIKE '/assets/img/product/%';
```

## 7. 이미지 최적화 권장사항

### 업로드 전 클라이언트 측 최적화:

- 이미지 크기 조정 (최대 800x600px)
- 품질 압축 (JPEG 80% 품질)
- WebP 포맷 사용 권장

### 서버 측 최적화 (향후 구현 가능):

- 이미지 리사이징 서비스
- CDN 연동
- 썸네일 자동 생성

## 8. 문제 해결

### 업로드 실패 시 확인사항:

1. 인터넷 연결 상태
2. 파일 형식 및 크기 제한
3. Supabase 프로젝트 상태
4. 환경 변수 설정
5. Storage 정책 설정

### 이미지 표시 안됨:

1. 이미지 URL 확인
2. 공개 읽기 정책 확인
3. 브라우저 캐시 초기화

## 9. 보안 고려사항

- 업로드된 이미지 파일 검증
- 파일 크기 제한 엄격히 적용
- 악성 파일 업로드 방지
- 정기적인 Storage 사용량 모니터링

## 10. 비용 최적화

- 불필요한 이미지 정기 삭제
- 이미지 압축 및 최적화
- CDN 활용으로 트래픽 절약
- Storage 사용량 모니터링
