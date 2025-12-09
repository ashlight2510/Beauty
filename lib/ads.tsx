'use client';

import { useEffect } from 'react';

export type AdProvider = 'kakao' | 'adsense' | 'none';

function KakaoAd() {
  useEffect(() => {
    // 이미 스크립트가 로드되어 있는지 확인
    if (document.querySelector('script[src*="ba.min.js"]')) {
      return;
    }

    // 카카오 애드핏 스크립트 로드
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거 (선택사항)
      const existingScript = document.querySelector('script[src*="ba.min.js"]');
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center min-h-[250px] flex items-center justify-center">
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit="DAN-Tu0inQd8JXIXAu0G"
        data-ad-width="300"
        data-ad-height="250"
      />
      <noscript>
        <div className="text-gray-400 text-sm">광고 영역 (카카오 애드핏)</div>
      </noscript>
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
  // 클라이언트에서 환경변수 확인
  const adProvider = (process.env.NEXT_PUBLIC_AD_PROVIDER as AdProvider) || 'kakao';
  
  // 디버깅용 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('AD_PROVIDER:', adProvider);
  }
  
  if (adProvider === 'kakao') return <KakaoAd />;
  if (adProvider === 'adsense') return <GoogleAd />;
  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-400">
      <p className="text-sm">광고 영역 (플레이스홀더)</p>
    </div>
  );
}
