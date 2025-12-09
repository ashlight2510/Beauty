'use client';

export type AdProvider = 'kakao' | 'adsense' | 'none';

// 현재 광고 제공자 설정 (환경변수나 설정 파일에서 가져올 수 있음)
export const AD_PROVIDER: AdProvider =
  (process.env.NEXT_PUBLIC_AD_PROVIDER as AdProvider) || 'none';

function KakaoAd() {
  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
      <p className="text-sm">광고 영역 (Kakao AdFit)</p>
    </div>
  );
}

function GoogleAd() {
  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
      <p className="text-sm">광고 영역 (Google AdSense)</p>
    </div>
  );
}

export function AdComponent() {
  if (AD_PROVIDER === 'kakao') return <KakaoAd />;
  if (AD_PROVIDER === 'adsense') return <GoogleAd />;
  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
      <p className="text-sm">광고 영역 (플레이스홀더)</p>
    </div>
  );
}
