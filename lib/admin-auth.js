import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_COOKIE = 'ecla_admin';

const token = () =>
  createHmac('sha256', process.env.SESSION_SECRET || '').update(process.env.ADMIN_PASSWORD || '').digest('hex');

const equals = (a, b) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function checkPassword(input) {
  return Boolean(process.env.ADMIN_PASSWORD) && equals(String(input || ''), process.env.ADMIN_PASSWORD);
}

export async function signIn() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function isSignedIn() {
  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE)?.value;
  return Boolean(value) && equals(value, token());
}

export async function requireAdmin() {
  if (!(await isSignedIn())) redirect('/admin/login');
}
