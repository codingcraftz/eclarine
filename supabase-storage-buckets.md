# 🗂️ Supabase Storage Bucket 설정 가이드

## 필요한 Storage Bucket 목록

### 1. **product-images**

- **용도**: 상품 이미지 저장
- **권한**: Public (읽기 전용)
- **파일 형식**: JPG, PNG, WebP
- **최대 크기**: 5MB

### 2. **category-images**

- **용도**: 카테고리 썸네일 이미지
- **권한**: Public (읽기 전용)
- **파일 형식**: JPG, PNG, WebP
- **최대 크기**: 2MB

### 3. **brand-logos**

- **용도**: 브랜드 로고 이미지
- **권한**: Public (읽기 전용)
- **파일 형식**: JPG, PNG, SVG
- **최대 크기**: 1MB

### 4. **user-avatars**

- **용도**: 사용자 프로필 이미지
- **권한**: Private (인증된 사용자만)
- **파일 형식**: JPG, PNG
- **최대 크기**: 2MB

### 5. **review-images**

- **용도**: 상품 리뷰 첨부 이미지
- **권한**: Public (읽기 전용)
- **파일 형식**: JPG, PNG
- **최대 크기**: 3MB

### 6. **documents**

- **용도**: 영수증, 송장 등 문서
- **권한**: Private (해당 사용자만)
- **파일 형식**: PDF, JPG, PNG
- **최대 크기**: 10MB

## Supabase Console에서 Bucket 생성 방법

### 1단계: Storage 메뉴 이동

- Supabase 대시보드 → Storage → Create bucket

### 2단계: Bucket 설정

#### product-images Bucket

```
Bucket name: product-images
Public bucket: ✅ (체크)
```

#### category-images Bucket

```
Bucket name: category-images
Public bucket: ✅ (체크)
```

#### brand-logos Bucket

```
Bucket name: brand-logos
Public bucket: ✅ (체크)
```

#### user-avatars Bucket

```
Bucket name: user-avatars
Public bucket: ❌ (체크 해제)
```

#### review-images Bucket

```
Bucket name: review-images
Public bucket: ✅ (체크)
```

#### documents Bucket

```
Bucket name: documents
Public bucket: ❌ (체크 해제)
```

## RLS (Row Level Security) 정책 설정

### SQL Editor에서 실행할 Storage 정책들:

```sql
-- 1. product-images 정책 (모든 사용자 읽기 가능, 관리자만 업로드)
CREATE POLICY "Public Access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 2. user-avatars 정책 (사용자는 본인 아바타만)
CREATE POLICY "Users can view own avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. review-images 정책 (모든 사용자 읽기, 인증된 사용자 업로드)
CREATE POLICY "Public Access for review images" ON storage.objects
FOR SELECT USING (bucket_id = 'review-images');

CREATE POLICY "Authenticated users can upload review images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'authenticated');

-- 4. documents 정책 (사용자는 본인 문서만)
CREATE POLICY "Users can view own documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 파일 업로드 헬퍼 함수 (JavaScript)

```javascript
// src/utils/uploadHelpers.js
import { supabase } from "@/lib/supabase";

export const uploadProductImage = async (file, productId) => {
  const fileName = `${productId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage.from("product-images").upload(fileName, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(fileName);

  return publicUrl.publicUrl;
};

export const uploadUserAvatar = async (file, userId) => {
  const fileName = `${userId}/avatar.${file.name.split(".").pop()}`;

  const { data, error } = await supabase.storage
    .from("user-avatars")
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage.from("user-avatars").getPublicUrl(fileName);

  return publicUrl.publicUrl;
};

export const uploadReviewImage = async (file, reviewId, index) => {
  const fileName = `${reviewId}/${index}-${Date.now()}.${file.name.split(".").pop()}`;

  const { data, error } = await supabase.storage.from("review-images").upload(fileName, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage.from("review-images").getPublicUrl(fileName);

  return publicUrl.publicUrl;
};
```

## 이미지 최적화 권장사항

1. **상품 이미지**: 800x800px, WebP 형식 권장
2. **카테고리 이미지**: 400x300px
3. **브랜드 로고**: 200x100px, SVG 또는 PNG
4. **사용자 아바타**: 200x200px, 원형 크롭
5. **리뷰 이미지**: 600x600px 이하

## 폴더 구조 예시

```
product-images/
├── 1/
│   ├── main.webp
│   ├── gallery-1.webp
│   └── gallery-2.webp
├── 2/
│   └── main.webp

user-avatars/
├── user-uuid-1/
│   └── avatar.webp
├── user-uuid-2/
│   └── avatar.webp

review-images/
├── review-1/
│   ├── 0-timestamp.webp
│   └── 1-timestamp.webp
```
