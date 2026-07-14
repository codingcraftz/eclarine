import { EclaMark } from '@/components/ui/ecla-ui';
import { BRAND } from '@/lib/pricing';

export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="pay-fade flex flex-col items-center gap-7 text-center">
        <div className="pay-float text-gold">
          <EclaMark size={64} />
        </div>

        <h1 className="pay-sheen font-[family-name:var(--font-jakarta)] text-5xl font-extrabold tracking-tight sm:text-6xl">
          Éclarine
        </h1>

        <p className="text-[15px] font-medium text-black/55">
          {BRAND} — 당신의 일상에 특별한 반짝임을
        </p>

        <div className="relative mt-2 h-px w-56 overflow-hidden bg-black/8 pay-bar">
          <span />
        </div>

        <p className="text-[13px] font-semibold tracking-[0.08em] text-gold-dark uppercase">
          Opening Soon
        </p>
      </div>
    </main>
  );
}
