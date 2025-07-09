-- ================================================================
-- 에끌라린 쇼핑몰 Storage Bucket 설정 (모든 PUBLIC 설정)
-- ================================================================

-- 1. 상품 이미지 bucket (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images', 
    'product-images', 
    true, 
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 2. 카테고리 이미지 bucket (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'category-images', 
    'category-images', 
    true, 
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- 3. 브랜드 로고 bucket (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'brand-logos', 
    'brand-logos', 
    true, 
    2097152, -- 2MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- 4. 사용자 아바타 bucket (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-avatars', 
    'user-avatars', 
    true, 
    1048576, -- 1MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- 5. 리뷰 이미지 bucket (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'review-images', 
    'review-images', 
    true, 
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- 6. 임시 업로드 bucket (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'temp-uploads', 
    'temp-uploads', 
    true, 
    20971520, -- 20MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- ================================================================
-- Storage 정책 설정 (간단한 PUBLIC 정책)
-- ================================================================

-- 모든 사용자가 모든 bucket에서 파일 조회 가능
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (true);

-- 인증된 사용자만 파일 업로드 가능
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 파일 업데이트 가능
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE 
WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 파일 삭제 가능  
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE 
USING (auth.role() = 'authenticated');

-- ================================================================
-- 완료 메시지
-- ================================================================
-- 🎉 모든 Storage bucket이 PUBLIC으로 설정되었습니다!
-- 
-- 생성된 PUBLIC Bucket (6개):
-- ✅ product-images (상품 이미지) - 10MB
-- ✅ category-images (카테고리 이미지) - 5MB  
-- ✅ brand-logos (브랜드 로고) - 2MB
-- ✅ user-avatars (사용자 아바타) - 1MB
-- ✅ review-images (리뷰 이미지) - 5MB
-- ✅ temp-uploads (임시 업로드) - 20MB
-- 
-- 📝 권한 설정:
-- - 모든 사용자: 파일 조회 가능
-- - 로그인한 사용자: 파일 업로드/수정/삭제 가능
-- 
-- 🚀 사용법:
-- 1. Supabase SQL Editor에서 이 스크립트 실행
-- 2. Storage 메뉴에서 6개 bucket 확인
-- 3. 각 bucket에 이미지 업로드 시작!
-- ================================================================ 