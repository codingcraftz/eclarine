'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CardFailPage() {
  return (
    <Suspense fallback={null}>
      <FailInner />
    </Suspense>
  );
}

function FailInner() {
  const sp = useSearchParams();
  const message = sp.get('message') || '결제가 취소되었거나 실패했어요.';

  return (
    <div className="pay-fade flex-1 grid place-items-center px-8 text-center">
      <div>
        <div className="text-[38px] mb-4">🙏</div>
        <h1 className="text-[20px] font-extrabold text-[#1A1A1A] mb-2">결제가 완료되지 않았어요</h1>
        <p className="text-[14px] text-[#7A7A7A] leading-relaxed break-keep">
          {message}
          <br />
          다시 시도하시거나 현금이체로도 주문하실 수 있어요.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-block text-[14px] font-bold text-white rounded-full px-7 py-3"
          style={{ background: '#1A1A1A' }}
        >
          다시 시도
        </Link>
      </div>
    </div>
  );
}
