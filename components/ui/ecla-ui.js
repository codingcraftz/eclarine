'use client';

import { useState } from 'react';
import Image from 'next/image';

export const GOLD = '#B8A06A';

// 로드 전 shimmer 스켈레톤 → 로드되면 부드럽게 페이드인 (fill 컨테이너 안에서 사용)
export function FadeImage({ src, alt, sizes, priority = false, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <span
        className={`absolute inset-0 ecla-shimmer transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-[opacity,transform] duration-700 ease-out ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
        } ${className}`}
      />
    </>
  );
}

// 골드 스파클 로고
export function EclaMark({ size = 44, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M23 7c.8 4.9 1.6 7.3 3.4 9.1 1.8 1.8 4.2 2.6 9.1 3.4-4.9.8-7.3 1.6-9.1 3.4-1.8 1.8-2.6 4.2-3.4 9.1-.8-4.9-1.6-7.3-3.4-9.1-1.8-1.8-4.2-2.6-9.1-3.4 4.9-.8 7.3-1.6 9.1-3.4C21.4 14.3 22.2 11.9 23 7Z" />
      <path d="M38 8.5v6M35 11.5h6" />
      <circle cx="13" cy="37" r="2.4" />
    </svg>
  );
}

// 전체화면 dim + blur + 회전하는 골드 스파클
export function LoadingOverlay({ label = '잠시만요…' }) {
  return (
    <div className="pay-fade fixed inset-0 z-[70] grid place-items-center bg-black/45 backdrop-blur-[5px]">
      <div className="flex flex-col items-center gap-5">
        <div className="ecla-spin" style={{ color: '#EADFC2' }}>
          <EclaMark size={56} />
        </div>
        <span className="text-[14px] font-semibold tracking-[0.02em] text-white/90">{label}</span>
      </div>
    </div>
  );
}

// clipboard API 실패 시 execCommand 폴백
export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  } catch {
    /* noop */
  }
}
