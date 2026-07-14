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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAFAF7',
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
