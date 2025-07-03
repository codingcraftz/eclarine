// Supabase 연결 테스트 스크립트
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// .env.local 파일 직접 읽기
function loadEnvFile() {
  try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    const envVars = {};

    envFile.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
      }
    });

    return envVars;
  } catch (error) {
    console.log("❌ .env.local 파일을 읽을 수 없습니다:", error.message);
    return {};
  }
}

async function testSupabaseConnection() {
  console.log("🔗 Supabase 연결 테스트 시작...\n");

  // 1. 환경 변수 확인
  console.log("1️⃣ 환경 변수 확인:");
  const envVars = loadEnvFile();
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log(`   SUPABASE_URL: ${supabaseUrl ? "✅ 설정됨" : "❌ 누락"}`);
  console.log(`   SUPABASE_KEY: ${supabaseKey ? "✅ 설정됨" : "❌ 누락"}`);

  if (supabaseUrl) {
    console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
  }

  if (!supabaseUrl || !supabaseKey) {
    console.log("\n❌ 환경 변수가 설정되지 않았습니다!");
    console.log("💡 .env.local 파일에 다음을 추가하세요:");
    console.log("   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url");
    console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key");
    return;
  }

  // 2. Supabase 클라이언트 초기화
  console.log("\n2️⃣ Supabase 클라이언트 초기화:");
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("   ✅ 클라이언트 생성 성공");

    // 3. 기본 연결 테스트
    console.log("\n3️⃣ 데이터베이스 연결 테스트:");
    const { data, error } = await supabase.from("categories").select("count").limit(1);

    if (error) {
      console.log(`   ❌ 연결 실패: ${error.message}`);

      // 테이블이 없는 경우일 수 있으므로 다른 방법으로 테스트
      console.log("\n4️⃣ Auth 서비스 테스트:");
      const { data: user, error: authError } = await supabase.auth.getUser();

      if (authError && authError.message.includes("Invalid JWT")) {
        console.log("   ✅ Auth 서비스 연결됨 (JWT 인증 정상)");
        console.log("   📝 테이블이 아직 생성되지 않았을 수 있습니다.");
      } else {
        console.log(`   ❌ Auth 서비스 오류: ${authError?.message}`);
      }
    } else {
      console.log("   ✅ 데이터베이스 연결 성공");
      console.log(`   📊 categories 테이블 접근 가능`);
    }

    // 5. 테이블 존재 여부 확인
    console.log("\n5️⃣ 주요 테이블 존재 확인:");
    const tables = ["categories", "products", "brands", "orders"];

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select("*").limit(1);

        if (error) {
          console.log(`   ❌ ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table}: 테이블 존재함 (${data?.length || 0}개 레코드)`);
        }
      } catch (err) {
        console.log(`   ❌ ${table}: ${err.message}`);
      }
    }

    // 6. Storage 버킷 확인
    console.log("\n6️⃣ Storage 버킷 확인:");
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

      if (bucketError) {
        console.log(`   ❌ Storage 접근 실패: ${bucketError.message}`);
      } else {
        console.log(`   ✅ Storage 접근 성공`);
        console.log(`   📦 버킷 수: ${buckets.length}개`);
        if (buckets.length > 0) {
          buckets.forEach((bucket) => {
            console.log(`      - ${bucket.name} (${bucket.public ? "Public" : "Private"})`);
          });
        } else {
          console.log("   📝 아직 Storage 버킷이 생성되지 않았습니다.");
        }
      }
    } catch (err) {
      console.log(`   ❌ Storage 오류: ${err.message}`);
    }
  } catch (error) {
    console.log(`   ❌ 클라이언트 생성 실패: ${error.message}`);
  }

  console.log("\n🏁 테스트 완료!");
  console.log("\n📋 요약:");
  console.log("   - 환경 변수가 설정되어 있으면 ✅");
  console.log("   - Auth 서비스가 연결되면 ✅");
  console.log("   - 테이블이 있으면 complete-supabase-schema.sql이 실행됨");
  console.log("   - 테이블이 없으면 아직 스키마를 실행하지 않음");
}

// 테스트 실행
testSupabaseConnection().catch(console.error);
