'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { checkPassword, requireAdmin, signIn, signOut } from '@/lib/admin-auth';
import { FORM_STATUSES, setFormStatus } from '@/lib/order-forms';

export async function login(_prev, formData) {
  if (!checkPassword(formData.get('password'))) return { error: '비밀번호가 올바르지 않아요.' };
  await signIn();
  redirect('/admin');
}

export async function logout() {
  await signOut();
  redirect('/admin/login');
}

export async function updateFormStatus(formData) {
  await requireAdmin();
  const status = String(formData.get('status'));
  if (!FORM_STATUSES.includes(status)) return;

  await setFormStatus(String(formData.get('id')), status);
  revalidatePath('/admin');
}
