import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://beauty.funnyfunny.cloud'
const ogImage = '/og-image.png'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '꾸밈비 파산 위험도 테스트 | Beauty Bankruptcy Test',
  description:
    '당신의 뷰티 지출 패턴을 분석하고 파산 위험도를 측정해보세요! 재미있는 테스트로 알아보는 나의 꾸밈비 현실 체크.',
  keywords: '꾸밈비, 파산 테스트, 뷰티 지출, 화장품 지출, 뷰티 테스트',
  openGraph: {
    title: '꾸밈비 파산 위험도 테스트',
    description: '당신의 뷰티 지출 패턴을 분석하고 파산 위험도를 측정해보세요!',
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Beauty Test preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '꾸밈비 파산 위험도 테스트',
    description: '당신의 뷰티 지출 패턴을 분석하고 파산 위험도를 측정해보세요!',
    images: [ogImage],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1204894220949193"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
