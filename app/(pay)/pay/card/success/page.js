'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EclaMark, LoadingOverlay, GOLD } from '@/components/ui/ecla-ui';
import { BRAND } from '@/lib/pricing';

export default function CardSuccessPage() {
  return (
    <Suspense fallback={<LoadingOverlay label="결제 확인 중…" />}>
      <SuccessInner />
    </Suspense>
  );
}

function SuccessInner() {
  const sp = useSearchParams();
  const [state, setState] = useState('confirming'); // confirming|done|error
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const paymentKey = sp.get('paymentKey');
    const orderId = sp.get('orderId');
    const amount = sp.get('amount');
    if (!paymentKey || !orderId || !amount) {
      setState('error');
      setMsg('결제 정보가 올바르지 않습니다.');
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });
        const data = await res.json();
        if (res.ok) setState('done');
        else {
          setState('error');
          setMsg(data?.error || '결제 승인에 실패했습니다.');
        }
      } catch {
        setState('error');
        setMsg('결제 승인 중 오류가 발생했습니다.');
      }
    })();
  }, [sp]);

  if (state === 'confirming') return <LoadingOverlay label="결제 확인 중…" />;

  if (state === 'error') {
    return (
      <div className="pay-fade flex-1 grid place-items-center px-8 text-center">
        <div>
          <div className="text-[38px] mb-4">🥲</div>
          <h1 className="text-[20px] font-extrabold text-[#1A1A1A] mb-2">결제 확인에 실패했어요</h1>
          <p className="text-[14px] text-[#7A7A7A] leading-relaxed">
            {msg}
            <br />
            결제가 되었는데도 이 화면이 보이면 카톡으로 알려주세요.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-block text-[14px] font-bold text-white rounded-full px-7 py-3"
            style={{ background: '#1A1A1A' }}
          >
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pay-fade flex-1 grid place-items-center px-8 text-center">
      <div>
        <div className="mx-auto mb-6 grid place-items-center w-16 h-16 rounded-full" style={{ background: GOLD }}>
          <EclaMark size={34} className="text-white" />
        </div>
        <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1A1A1A] mb-2">결제가 완료되었어요</h1>
        <p className="text-[14.5px] text-[#7A7A7A] leading-relaxed">
          정성껏 준비해 보내드릴게요.
          <br />
          {BRAND}을(를) 찾아주셔서 감사합니다 :)
        </p>
      </div>
    </div>
  );
}
