import Link from 'next/link';

// 상태별로 갈라 보되 현재 검색어는 유지한다
export default function StatusTabs({ tabs, current, q }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
      {tabs.map((t) => {
        const params = new URLSearchParams();
        if (t.value !== '전체') params.set('status', t.value);
        if (q) params.set('q', q);
        const query = params.toString();
        const on = current === t.value;

        return (
          <Link
            key={t.value}
            href={query ? `/admin?${query}` : '/admin'}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-bold ${
              on ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#8A8A8A] border border-black/[0.08]'
            }`}
          >
            {t.value}
            <span className={`ml-1.5 ${on ? 'text-white/60' : 'text-[#C0C0BA]'}`}>{t.count}</span>
          </Link>
        );
      })}
    </div>
  );
}
