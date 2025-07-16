-- 🔍 현재 Supabase 데이터베이스 구조 확인 쿼리
-- 아래 쿼리들을 Supabase SQL 에디터에서 하나씩 실행하세요

-- ========================================
-- 1. 모든 테이블 목록 조회
-- ========================================
SELECT 
    table_name,
    table_type,
    is_insertable_into,
    is_typed
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ========================================
-- 2. 각 테이블의 컬럼 정보 조회
-- ========================================
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length,
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ========================================
-- 3. Foreign Key 관계 조회
-- ========================================
SELECT
    tc.table_name as table_name,
    kcu.column_name as column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
    AND tc.table_schema = rc.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ========================================
-- 4. 인덱스 정보 조회
-- ========================================
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ========================================
-- 5. 특정 테이블들의 샘플 데이터 조회
-- ========================================

-- products 테이블 샘플 (있다면)
SELECT 'products' as table_name, count(*) as row_count FROM products
UNION ALL
SELECT 'categories' as table_name, count(*) as row_count FROM categories
UNION ALL
SELECT 'brands' as table_name, count(*) as row_count FROM brands
UNION ALL
SELECT 'orders' as table_name, count(*) as row_count FROM orders
UNION ALL
SELECT 'user_profiles' as table_name, count(*) as row_count FROM user_profiles;

-- ========================================
-- 6. products 테이블 구조 상세 조회 (있다면)
-- ========================================
SELECT * FROM products LIMIT 1;

-- ========================================
-- 7. categories 테이블 구조 상세 조회 (있다면)
-- ========================================
SELECT * FROM categories LIMIT 1;

-- ========================================
-- 8. brands 테이블 구조 상세 조회 (있다면)
-- ========================================
SELECT * FROM brands LIMIT 1;

-- ========================================
-- 9. orders 테이블 구조 상세 조회 (있다면)
-- ========================================
SELECT * FROM orders LIMIT 1;

-- ========================================
-- 10. user_profiles 테이블 구조 상세 조회 (있다면)
-- ========================================
SELECT * FROM user_profiles LIMIT 1;

-- ========================================
-- 11. RLS (Row Level Security) 정책 확인
-- ========================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 12. 트리거 정보 조회
-- ========================================
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ========================================
-- 13. 함수 정보 조회
-- ========================================
SELECT 
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ========================================
-- 14. 시퀀스 정보 조회
-- ========================================
SELECT 
    sequence_name,
    data_type,
    start_value,
    minimum_value,
    maximum_value,
    increment
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name; 