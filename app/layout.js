import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { BRAND } from '@/lib/pricing';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata = {
  title: {
    default: `${BRAND} · 감성 주얼리`,
    template: `%s · ${BRAND}`,
  },
  description:
    '당신의 일상에 특별한 반짝임을 선물해줄 감성 주얼리샵 에끌라린입니다. 925 실버, 14K·18K 골드, 써지컬 스틸.',
  openGraph: {
    type: 'website',
    siteName: BRAND,
    locale: 'ko_KR',
  },
};

// 크림+골드 팔레트 전용이라 브라우저 자동 다크 변환(force dark)을 끈다.
// 선언이 없으면 반투명·그라디언트가 뒤집혀 로딩바와 계좌 카드가 깨진다.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAFAF7',
  colorScheme: 'light',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={jakarta.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
