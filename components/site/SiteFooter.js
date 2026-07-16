import { COMPANY } from '@/lib/site';

const biz = `${COMPANY.company} · 대표 ${COMPANY.ceo} · 사업자등록번호 ${COMPANY.businessNumber} · 통신판매업신고 ${COMPANY.ecommerceNumber}`;

export default function SiteFooter() {
  return (
    <footer id="footer" className="border-t border-black/[0.07] bg-[#F5F2EA]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3 sm:px-8">
        <div>
          <div className="mb-3 font-[family-name:var(--font-jakarta)] text-[17px] font-extrabold text-ink">
            Éclarine
          </div>
          <p className="text-[13px] leading-relaxed text-black/55">
            925 실버 · 14K 골드 · 써지컬 스틸.
            <br />
            당신의 일상에 특별한 반짝임을.
          </p>
        </div>

        <div className="text-[13px] leading-relaxed text-black/60">
          <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em] text-gold-dark">고객센터</div>
          <a href={COMPANY.kakaoChannel} target="_blank" rel="noreferrer" className="font-semibold text-ink hover:text-gold-dark">
            카카오톡 채널 문의 →
          </a>
          <div className="mt-1">{COMPANY.email}</div>
          <div className="mt-3 text-[12px] text-black/45">
            {COMPANY.freeShippingOver.toLocaleString('ko-KR')}원 이상 무료배송 · 기본 배송비{' '}
            {COMPANY.shippingFee.toLocaleString('ko-KR')}원
          </div>
        </div>

        <div className="text-[13px] leading-relaxed text-black/60">
          <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em] text-gold-dark">무통장 입금</div>
          <div className="font-semibold text-ink">
            {COMPANY.account.bank} {COMPANY.account.number}
          </div>
          <div className="text-black/50">예금주 {COMPANY.account.holder}</div>
        </div>
      </div>

      <div className="border-t border-black/[0.06] px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-6xl text-[11.5px] leading-relaxed text-black/40">
          <p>{biz}</p>
          <p className="mt-0.5">{COMPANY.address}</p>
          <p className="mt-2">© {COMPANY.brand} · {COMPANY.company}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
