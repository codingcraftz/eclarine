'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EclaMark } from '@/components/ui/ecla-ui';

const LINKS = [
  { href: '#products', label: '전체상품' },
  { href: '/shop', label: '라이브' },
  { href: '#footer', label: '고객센터' },
];

export default function SiteNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-[#FAFAF7]/85 backdrop-blur border-b border-black/[0.06]' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-gold">
          <EclaMark size={26} />
          <span className="font-[family-name:var(--font-jakarta)] text-[19px] font-extrabold tracking-[0.02em] text-ink">
            Éclarine
          </span>
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-semibold text-black/60 transition-colors hover:text-gold-dark"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
