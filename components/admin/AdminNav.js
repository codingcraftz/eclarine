import Link from 'next/link';

import { logout } from '@/app/(admin)/admin/actions';

const TABS = [
  { key: 'form', href: '/admin', label: '주문서' },
  { key: 'pay', href: '/admin/pay', label: '결제주문' },
  { key: 'products', href: '/admin/products', label: '상품' },
];

export default function AdminNav({ current }) {
  return (
    <header className="flex items-center justify-between">
      <nav className="flex gap-1.5">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold ${
              current === t.key ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#8A8A8A] border border-black/[0.08]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <form action={logout}>
        <button type="submit" className="text-[12.5px] font-bold text-[#9A9A95]">
          로그아웃
        </button>
      </form>
    </header>
  );
}
