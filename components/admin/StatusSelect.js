'use client';

import { useTransition } from 'react';

// 서버 액션을 prop으로 받아 select 변경 즉시 제출한다.
export default function StatusSelect({ action, id, value, options, colors = {}, className = '' }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={value}
      disabled={pending}
      onChange={(e) => {
        const data = new FormData();
        data.append('id', id);
        data.append('status', e.target.value);
        startTransition(() => action(data));
      }}
      className={`rounded-lg border border-black/[0.12] bg-white px-2.5 py-1.5 text-[12.5px] font-bold outline-none disabled:opacity-50 ${className}`}
      style={{ color: colors[value] || '#1A1A1A' }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
