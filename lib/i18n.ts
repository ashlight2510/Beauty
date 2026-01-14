export type Language = 'ko' | 'en';

export const translations = {
  ko: {
    loading: '로딩 중...',
    testStart: '테스트 시작하기 →',
    otherTests: '다른 테스트 해보기',
    resultDisclaimer: '⚠️ 결과는 재미로만 참고하세요!',
    testResult: '🎯 테스트 결과',
    yourRiskGrade: '당신의 위험도 등급은',
    points: '점',
    beautyRatio: '당신의 꾸밈비 비율',
    percentileDesc: '다른 사람들과 비교했을 때의 위치입니다',
    stockpileTitle: '1년 후 예상 재고량',
    stockpileDesc: '반쯤 남은 스킨케어 제품',
    bottles: '병',
    items: '개',
    fiveYearTitle: '5년 후 누적 지출',
    fiveYearDesc: '현재 패턴을 유지한다면 예상되는 총 지출입니다',
    shareResult: '📤 결과 공유하기',
    retakeTest: '🔄 다시 테스트하기',
    otherTestsResult: '✨ 다른 테스트 해보기',
    calculating: '결과를 계산 중...',
    previousQuestion: '← 이전 질문',
    linkCopied: '링크가 복사되었습니다!',
    // Risk grades
    gradeMinimalist: '무소속 미니멀리스트',
    gradeMinimalistDesc: '당신은 뷰티 소비의 달인! 절제력이 뛰어나시네요.',
    gradeStable: '꾸밈비 안정군',
    gradeStableDesc: '적당한 선에서 즐기시는 현명한 소비자입니다.',
    gradeCaution: '주의군',
    gradeCautionDesc: '조금만 더 신중하게 결정하시면 좋을 것 같아요.',
    gradeHighRisk: '고위험군',
    gradeHighRiskDesc: '통장이 조금씩 울고 있어요. 한 번 점검해볼까요?',
    gradeBankrupt: '파산 확정 💸',
    gradeBankruptDesc: '화장대에 난민촌이 생길 예정입니다. 지금 멈추세요!',
  },
  en: {
    loading: 'Loading...',
    testStart: 'Start Test →',
    otherTests: 'Try Other Tests',
    resultDisclaimer: '⚠️ Results are for fun only!',
    testResult: '🎯 Test Result',
    yourRiskGrade: 'Your Risk Grade',
    points: 'points',
    beautyRatio: 'Your Beauty Spending Ratio',
    percentileDesc: 'Your position compared to others',
    stockpileTitle: 'Expected Stockpile After 1 Year',
    stockpileDesc: 'Half-used skincare products',
    bottles: 'bottles',
    items: 'items',
    fiveYearTitle: '5-Year Cumulative Spending',
    fiveYearDesc: 'Total expected spending if current pattern is maintained',
    shareResult: '📤 Share Result',
    retakeTest: '🔄 Retake Test',
    otherTestsResult: '✨ Try Other Tests',
    calculating: 'Calculating result...',
    previousQuestion: '← Previous Question',
    linkCopied: 'Link copied!',
    // Risk grades
    gradeMinimalist: 'Minimalist',
    gradeMinimalistDesc: 'You are a master of beauty spending! Excellent self-control.',
    gradeStable: 'Stable Beauty Spender',
    gradeStableDesc: 'You are a wise consumer who enjoys within reasonable limits.',
    gradeCaution: 'Caution Zone',
    gradeCautionDesc: 'It would be good to make decisions a bit more carefully.',
    gradeHighRisk: 'High Risk Zone',
    gradeHighRiskDesc: 'Your wallet is crying a little. Shall we check it?',
    gradeBankrupt: 'Bankruptcy Confirmed 💸',
    gradeBankruptDesc: 'A refugee camp will form on your vanity. Stop now!',
  },
};

export function detectLang(): Language {
  if (typeof window === 'undefined') return 'ko';
  
  const stored = localStorage.getItem('preferredLang') as Language | null;
  if (stored && (stored === 'ko' || stored === 'en')) return stored;
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang.startsWith('ko')) return 'ko';
  
  return 'en';
}

export function setLang(lang: Language) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('preferredLang', lang);
}

export function t(key: keyof typeof translations.ko, lang: Language = 'ko'): string {
  return translations[lang]?.[key] || translations.ko[key] || key;
}
