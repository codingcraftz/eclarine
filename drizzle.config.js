// drizzle-kit은 Next와 달리 .env.local을 자동으로 읽지 않는다
if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile('.env.local');
  } catch {
    /* CI 등 파일이 없는 환경 */
  }
}

export default {
  schema: './lib/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL },
};
