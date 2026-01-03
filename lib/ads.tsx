'use client';

export type AdProvider = 'adsense' | 'none';

function GoogleAd() {
  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
      <p className="text-sm">광고 영역 (Google AdSense)</p>
    </div>
  );
}

export function AdComponent() {
  // 클라이언트에서 환경변수 확인
  const adProvider = (process.env.NEXT_PUBLIC_AD_PROVIDER as AdProvider) || 'adsense';
  
  // 디버깅용 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('AD_PROVIDER:', adProvider);
  }
  
  if (adProvider === 'adsense') return <GoogleAd />;
  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
      <p className="text-sm">광고 영역 (플레이스홀더)</p>
    </div>
  );
}
