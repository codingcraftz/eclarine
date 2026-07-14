import 'server-only';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

// dev의 HMR이 매 리로드마다 풀을 새로 만들지 않도록 전역에 캐시
const globalForDb = globalThis;

const pool =
  globalForDb.__eclarinePool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

if (process.env.NODE_ENV !== 'production') globalForDb.__eclarinePool = pool;

export const db = drizzle(pool, { schema });
export * from './schema';
