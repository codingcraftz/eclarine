import Link from 'next/link';
import { EclaMark, FadeImage } from '@/components/ui/ecla-ui';
import SiteNav from '@/components/site/SiteNav';
import ProductGrid from '@/components/site/ProductGrid';
import SiteFooter from '@/components/site/SiteFooter';

export const metadata = {
  title: '에끌라린 · 감성 실버 주얼리',
  description:
    '925 실버·14K 골드·써지컬 스틸 감성 주얼리샵 에끌라린. 알레르기 안전 소재, 당신의 일상에 특별한 반짝임을.',
};

export default function Home() {
  return (
    <>
      <SiteNav />

      <main>
        {/* HERO */}
        <section className="relative flex min-h-dvh items-center overflow-hidden bg-[#FAFAF7]">
          {/* 우측 브랜드 이미지 (데스크톱) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
            <div className="relative h-full w-full">
              <FadeImage src="/products/6.jpeg" alt="에끌라린 주얼리" sizes="46vw" priority />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF7] via-transparent to-transparent" />
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="pay-fade max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/50 px-3.5 py-1.5 text-gold-dark">
                <EclaMark size={16} />
                <span className="font-[family-name:var(--font-jakarta)] text-[11px] font-bold uppercase tracking-[0.22em]">
                  All Silver Jewelry
                </span>
              </div>

              <h1 className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[58px]">
                당신을 더<br />
                <span className="pay-sheen">빛나게</span>
              </h1>

              <p className="mt-6 max-w-md break-keep text-[15px] leading-relaxed text-black/55 sm:text-[16px]">
                925 실버부터 14K 골드, 써지컬 스틸까지. 알레르기 걱정 없는 소재로 매일 편하게 빛나는
                에끌라린 감성 주얼리.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="#products"
                  className="rounded-full bg-ink px-7 py-3.5 text-[15px] font-bold text-white transition-transform active:scale-[0.98]"
                >
                  컬렉션 둘러보기
                </Link>
                <Link
                  href="/shop"
                  className="rounded-full border border-black/15 bg-white/60 px-7 py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-gold"
                >
                  라이브 방송 주문
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ProductGrid />

        {/* 브랜드 스토리 */}
        <section className="bg-[#F5F2EA]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#F1EEE6]">
              <FadeImage src="/products/3.jpeg" alt="에끌라린 실버 주얼리" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
            <div>
              <div className="mb-3 font-[family-name:var(--font-jakarta)] text-[12px] font-bold uppercase tracking-[0.3em] text-gold-dark">
                About Éclarine
              </div>
              <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[34px]">
                피부에 닿는 것부터
                <br />
                다르게
              </h2>
              <p className="mt-6 break-keep text-[15px] leading-relaxed text-black/60">
                에끌라린은 알레르기 안전 소재만 고집합니다. 925 실버, 14K·18K 골드, 316L 써지컬 스틸로
                매일 착용해도 편안하고, 오래 봐도 질리지 않는 디자인을 만듭니다.
              </p>
              <ul className="mt-7 flex flex-col gap-3">
                {[
                  ['알레르기 안전 소재', '925 실버 · 14K 골드 · 써지컬 스틸'],
                  ['원하는 사이즈 주문 제작', '반지·팔찌 사이즈 맞춤'],
                  ['친절 상담', '카카오톡 채널로 언제든'],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1 text-gold">
                      <EclaMark size={18} />
                    </span>
                    <div>
                      <div className="text-[14.5px] font-bold text-ink">{t}</div>
                      <div className="text-[13px] text-black/50">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
