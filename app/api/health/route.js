import { sql } from 'drizzle-orm';

import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {};

  try {
    const r = await db.execute(
      sql`select count(*)::int as n from information_schema.tables where table_schema = 'public'`
    );
    checks.db = { ok: true, tables: r.rows[0].n };
  } catch (e) {
    checks.db = { ok: false, error: e.message };
  }

  try {
    const r = await fetch(`${process.env.S3_ENDPOINT}/product-images/`, {
      signal: AbortSignal.timeout(5000),
    });
    checks.storage = { ok: r.status < 500, status: r.status };
  } catch (e) {
    checks.storage = { ok: false, error: e.message };
  }

  const ok = checks.db.ok && checks.storage.ok;
  return Response.json({ ok, ...checks }, { status: ok ? 200 : 503 });
}
