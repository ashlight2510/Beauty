import { Answers, RiskGrade, Stockpile, TestResult } from './types';

// 기본 메시지 (config에 없을 때 사용)
const defaultMessages = [
  '테스트 결과 메시지입니다.',
  '재미있는 결과네요!',
  '흥미로운 결과입니다.',
];

function getRandomMessage(messages?: string[]): string {
  const messageList = messages && messages.length > 0 ? messages : defaultMessages;
  return messageList[Math.floor(Math.random() * messageList.length)];
}

// 답변을 숫자 값으로 변환
export function convertAnswersToValues(
  choices: Record<string, string>,
  questions: Array<{ id: string; choices: Array<{ label: string; value: number }> }>
): Answers {
  const answers: Answers = {};
  
  questions.forEach((question) => {
    const selectedLabel = choices[question.id];
    if (selectedLabel) {
      const choice = question.choices.find((c) => c.label === selectedLabel);
      if (choice) {
        answers[question.id] = choice.value;
      }
    }
  });
  
  return answers;
}

// 위험도 점수 계산 (beauty_default 방법)
export function calculateBeautyRisk(answers: Answers): number {
  const income = answers.income || 1;
  const totalBeautySpending = answers.totalBeauty || 0;
  const instagramHours = answers.instagram || 0;
  const shoppingAppHours = answers.shoppingApp || 0;
  const unopenedProducts = answers.unopened || 0;
  const selfJustification = answers.justification || 0;
  
  const beautyRatio = income > 0 
    ? (totalBeautySpending / income) * 100 
    : 0;
  
  // SNS 시간과 쇼핑 시간을 0-100 스케일로 정규화
  const snsScore = Math.min(instagramHours * 20, 100);
  const shoppingScore = Math.min(shoppingAppHours * 33, 100);
  
  // 위험도 점수 계산 (0-100)
  const riskScore = beautyRatio * 0.6 + snsScore * 0.2 + shoppingScore * 0.2;
  
  // 추가 페널티 (안 뜯은 제품, 자기합리화 등)
  const penalty = (unopenedProducts * 2) + (selfJustification * 2);
  
  return Math.min(riskScore + penalty, 100);
}

// 위험도 등급 반환
export function getRiskGrade(riskScore: number, lang: 'ko' | 'en' = 'ko'): RiskGrade {
  if (riskScore <= 15) {
    return {
      grade: lang === 'en' ? 'Minimalist' : '무소속 미니멀리스트',
      description: lang === 'en' ? 'You are a master of beauty spending! Excellent self-control.' : '당신은 뷰티 소비의 달인! 절제력이 뛰어나시네요.',
      color: 'text-green-600',
    };
  } else if (riskScore <= 35) {
    return {
      grade: lang === 'en' ? 'Stable Beauty Spender' : '꾸밈비 안정군',
      description: lang === 'en' ? 'You are a wise consumer who enjoys within reasonable limits.' : '적당한 선에서 즐기시는 현명한 소비자입니다.',
      color: 'text-blue-600',
    };
  } else if (riskScore <= 55) {
    return {
      grade: lang === 'en' ? 'Caution Zone' : '주의군',
      description: lang === 'en' ? 'It would be good to make decisions a bit more carefully.' : '조금만 더 신중하게 결정하시면 좋을 것 같아요.',
      color: 'text-yellow-600',
    };
  } else if (riskScore <= 75) {
    return {
      grade: lang === 'en' ? 'High Risk Zone' : '고위험군',
      description: lang === 'en' ? 'Your wallet is crying a little. Shall we check it?' : '통장이 조금씩 울고 있어요. 한 번 점검해볼까요?',
      color: 'text-orange-600',
    };
  } else {
    return {
      grade: lang === 'en' ? 'Bankruptcy Confirmed 💸' : '파산 확정 💸',
      description: lang === 'en' ? 'A refugee camp will form on your vanity. Stop now!' : '화장대에 난민촌이 생길 예정입니다. 지금 멈추세요!',
      color: 'text-red-600',
    };
  }
}

// 퍼센타일 계산
export function calculatePercentile(riskScore: number): number {
  if (riskScore <= 15) {
    return 20;
  } else if (riskScore <= 35) {
    return 50;
  } else if (riskScore <= 55) {
    return 70;
  } else if (riskScore <= 75) {
    return 90;
  } else {
    return 95;
  }
}

// 1년 재고량 추정
export function calculateStockpile(answers: Answers): Stockpile {
  const monthlyCosmetics = answers.makeup || 0;
  const monthlySkincare = answers.skincare || 0;
  
  // 1년치의 35%가 미사용으로 쌓인다고 가정
  const stockpileValue = (monthlyCosmetics + monthlySkincare) * 12 * 0.35;
  
  // 립스틱 1개 = 평균 3만원, 스킨케어 1병 = 평균 5만원으로 가정
  const lipsticks = Math.round(stockpileValue * 0.4 / 3);
  const skincareBottles = Math.round(stockpileValue * 0.6 / 5);
  
  return {
    lipsticks: Math.max(lipsticks, 0),
    skincareBottles: Math.max(skincareBottles, 0),
  };
}

// 5년 누적 지출 계산
export function calculateFiveYearSpending(answers: Answers): number {
  // totalBeauty는 만원 단위이므로 원 단위로 변환 (× 10000)
  const totalBeautySpending = answers.totalBeauty || 0;
  return totalBeautySpending * 10000 * 12 * 5;
}

// 숫자를 원화 형식으로 포맷팅
export function formatWon(amount: number, lang: 'ko' | 'en' = 'ko'): string {
  if (lang === 'en') {
    // 영어일 때는 간단한 형식
    if (amount >= 100000000) {
      return `₩${(amount / 100000000).toFixed(1)}억`;
    } else if (amount >= 10000) {
      return `₩${(amount / 10000).toFixed(0)}만`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  }
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

// 메인 계산 함수 - scoringMethod에 따라 분기
export function calculate(
  scoringMethod: string,
  answers: Answers,
  resultMessages?: string[]
): TestResult {
  let riskScore: number;
  
  if (scoringMethod === 'beauty_default') {
    riskScore = calculateBeautyRisk(answers);
  } else {
    // 기본값
    riskScore = 50;
  }
  
  const grade = getRiskGrade(riskScore);
  const percentile = calculatePercentile(riskScore);
  const stockpile = calculateStockpile(answers);
  const fiveYear = calculateFiveYearSpending(answers);
  
  // 메시지는 config에서 가져오거나 기본값 사용
  const message = getRandomMessage(resultMessages);
  
  return {
    riskScore,
    grade,
    percentile,
    stockpile,
    fiveYear,
    message,
  };
}

