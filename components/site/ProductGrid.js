'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FadeImage } from '@/components/ui/ecla-ui';
import { formatKRW } from '@/lib/pricing';
import { SHOWCASE, CATEGORIES } from '@/lib/site';

export default function ProductGrid() {
  const [cat, setCat] = useState('전체');
  const shown = cat === '전체' ? SHOWCASE : SHOWCASE.filter((p) => p.type === cat);

  return (
    <section id="products" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mb-3 text-center font-[family-name:var(--font-jakarta)] text-[12px] font-bold uppercase tracking-[0.3em] text-gold-dark">
        Collection
      </div>
      <h2 className="mb-10 text-center text-[26px] font-extrabold tracking-[-0.02em] text-ink sm:text-[32px]">
        오늘의 반짝임
      </h2>

      <div className="mb-9 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              cat === c ? 'bg-ink text-white' : 'bg-black/[0.04] text-black/55 hover:bg-black/[0.07]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-[14px] text-black/40">해당 카테고리 상품이 곧 올라와요 :)</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {shown.map((p) => (
            <article key={p.id} className="group">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F1EEE6]">
                <FadeImage
                  src={p.img}
                  alt={p.name}
                  sizes="(max-width:640px) 50vw, 25vw"
                  className="transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="mt-3 px-0.5">
                <div className="font-[family-name:var(--font-jakarta)] text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
                  {p.type}
                </div>
                <h3 className="mt-0.5 break-keep text-[14px] font-bold leading-snug text-ink">{p.name}</h3>
                <div className="mt-1 text-[14px] font-extrabold text-ink">{formatKRW(p.price)}</div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-14 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[15px] font-bold text-white transition-transform active:scale-[0.98]"
        >
          라이브 방송에서 주문하기
        </Link>
        <p className="mt-3 text-[13px] text-black/45">방송 중 안내된 상품은 라이브 페이지에서 바로 결제하실 수 있어요.</p>
      </div>
    </section>
  );
}
