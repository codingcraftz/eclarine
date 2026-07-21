'use client';

import { useActionState } from 'react';

import { EclaMark, GOLD } from '@/components/ui/ecla-ui';
import { login } from '@/app/(admin)/admin/actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="w-full max-w-xs bg-white rounded-2xl border border-black/[0.07] p-7">
      <div className="grid place-items-center mb-5" style={{ color: GOLD }}>
        <EclaMark size={40} />
      </div>
      <h1 className="text-[17px] font-extrabold text-center mb-6">에끌라린 관리자</h1>
      <input
        name="password"
        type="password"
        autoFocus
        placeholder="비밀번호"
        className="pay-input"
      />
      {state?.error && <p className="mt-2 text-[13px] text-[#E85D3A] font-medium">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full text-[15px] font-bold rounded-xl py-3 text-white bg-[#1A1A1A] disabled:opacity-50"
      >
        {pending ? '확인 중…' : '로그인'}
      </button>
    </form>
  );
}
