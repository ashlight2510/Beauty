export interface Answers {
  income: number; // 월 소득
  totalBeautySpending: number; // 한 달 총 꾸밈비
  makeupSpending: number; // 화장품 지출
  skincareSpending: number; // 스킨케어 지출
  nailHairFrequency: number; // 네일/헤어 관리 주기 (월)
  fashionFrequency: number; // 패션 쇼핑 빈도 점수
  instagramHours: number; // 하루 인스타 시간
  shoppingAppHours: number; // 쇼핑앱 보는 시간
  saleReaction: number; // 세일 반응 점수
  unopenedProducts: number; // 안 뜯은 화장품 개수
  selfJustification: number; // 자기합리화 빈도
}

// 선택지 값을 숫자로 매핑하는 함수들
export const mapIncome = (choice: string): number => {
  const map: Record<string, number> = {
    '0~50만원': 25,
    '50~100만원': 75,
    '100~200만원': 150,
    '200~300만원': 250,
    '300~500만원': 400,
    '500만원 이상': 750,
  };
  return map[choice] || 0;
};

export const mapTotalBeauty = (choice: string): number => {
  const map: Record<string, number> = {
    '0~5만원': 2.5,
    '5~10만원': 7.5,
    '10~20만원': 15,
    '20~40만원': 30,
    '40~70만원': 55,
    '70~100만원': 85,
    '100만원 이상': 150,
  };
  return map[choice] || 0;
};

export const mapMakeup = (choice: string): number => {
  const map: Record<string, number> = {
    '0~3만원': 1.5,
    '3~7만원': 5,
    '7~15만원': 11,
    '15~30만원': 22.5,
    '30만원 이상': 50,
  };
  return map[choice] || 0;
};

export const mapSkincare = (choice: string): number => {
  const map: Record<string, number> = {
    '0~2만원': 1,
    '2~5만원': 3.5,
    '5~10만원': 7.5,
    '10~20만원': 15,
    '20만원 이상': 35,
  };
  return map[choice] || 0;
};

export const mapNailHair = (choice: string): number => {
  const map: Record<string, number> = {
    '안 함': 0,
    '월 1회': 1,
    '월 2회': 2,
    '월 3회 이상': 4,
  };
  return map[choice] || 0;
};

export const mapFashionFrequency = (choice: string): number => {
  const map: Record<string, number> = {
    '거의 안 함': 0.5,
    '월 1번': 1,
    '월 2~3번': 2.5,
    '주 1~2번': 6,
    '거의 매일 "미리보기" 탐색함': 20,
  };
  return map[choice] || 0;
};

export const mapInstagramHours = (choice: string): number => {
  const map: Record<string, number> = {
    '0~30분': 0.25,
    '30~60분': 0.75,
    '1~2시간': 1.5,
    '2~4시간': 3,
    '4시간 이상': 5,
  };
  return map[choice] || 0;
};

export const mapShoppingAppHours = (choice: string): number => {
  const map: Record<string, number> = {
    '안 봄': 0,
    '10~20분': 0.25,
    '30~60분': 0.75,
    '1~2시간': 1.5,
    '2시간 이상': 3,
  };
  return map[choice] || 0;
};

export const mapSaleReaction = (choice: string): number => {
  const map: Record<string, number> = {
    '"침착함 유지 가능"': 1,
    '"그래도 안 삼"': 2,
    '"일단 장바구니에 넣음"': 4,
    '"세일은 운명"': 6,
    '"사야 절약임"': 8,
    '"본능 OFF / 결제 ON"': 10,
  };
  return map[choice] || 0;
};

export const mapUnopenedProducts = (choice: string): number => {
  const map: Record<string, number> = {
    '0개': 0,
    '1~3개': 2,
    '4~7개': 5.5,
    '8~15개': 11.5,
    '15개 이상': 20,
  };
  return map[choice] || 0;
};

export const mapSelfJustification = (choice: string): number => {
  const map: Record<string, number> = {
    '없음': 0,
    '가끔': 2,
    '자주': 5,
    '매번': 10,
  };
  return map[choice] || 0;
};

// 답변 객체를 생성하는 함수
export function createAnswersFromChoices(choices: Record<string, string>): Answers {
  return {
    income: mapIncome(choices.income || ''),
    totalBeautySpending: mapTotalBeauty(choices.totalBeauty || ''),
    makeupSpending: mapMakeup(choices.makeup || ''),
    skincareSpending: mapSkincare(choices.skincare || ''),
    nailHairFrequency: mapNailHair(choices.nailHair || ''),
    fashionFrequency: mapFashionFrequency(choices.fashion || ''),
    instagramHours: mapInstagramHours(choices.instagram || ''),
    shoppingAppHours: mapShoppingAppHours(choices.shoppingApp || ''),
    saleReaction: mapSaleReaction(choices.sale || ''),
    unopenedProducts: mapUnopenedProducts(choices.unopened || ''),
    selfJustification: mapSelfJustification(choices.justification || ''),
  };
}

// 위험도 점수 계산
export function calculateRiskScore(answers: Answers): number {
  const beautyRatio = answers.income > 0 
    ? (answers.totalBeautySpending / answers.income) * 100 
    : 0;
  
  // SNS 시간과 쇼핑 시간을 0-100 스케일로 정규화
  const snsScore = Math.min(answers.instagramHours * 20, 100);
  const shoppingScore = Math.min(answers.shoppingAppHours * 33, 100);
  
  // 위험도 점수 계산 (0-100)
  const riskScore = beautyRatio * 0.6 + snsScore * 0.2 + shoppingScore * 0.2;
  
  // 추가 페널티 (안 뜯은 제품, 자기합리화 등)
  const penalty = (answers.unopenedProducts * 2) + (answers.selfJustification * 2);
  
  return Math.min(riskScore + penalty, 100);
}

// 위험도 등급 반환
export function getRiskGrade(riskScore: number): {
  grade: string;
  description: string;
  color: string;
} {
  if (riskScore <= 15) {
    return {
      grade: '무소속 미니멀리스트',
      description: '당신은 뷰티 소비의 달인! 절제력이 뛰어나시네요.',
      color: 'text-green-600',
    };
  } else if (riskScore <= 35) {
    return {
      grade: '꾸밈비 안정군',
      description: '적당한 선에서 즐기시는 현명한 소비자입니다.',
      color: 'text-blue-600',
    };
  } else if (riskScore <= 55) {
    return {
      grade: '주의군',
      description: '조금만 더 신중하게 결정하시면 좋을 것 같아요.',
      color: 'text-yellow-600',
    };
  } else if (riskScore <= 75) {
    return {
      grade: '고위험군',
      description: '통장이 조금씩 울고 있어요. 한 번 점검해볼까요?',
      color: 'text-orange-600',
    };
  } else {
    return {
      grade: '파산 확정 💸',
      description: '화장대에 난민촌이 생길 예정입니다. 지금 멈추세요!',
      color: 'text-red-600',
    };
  }
}

// 1년 재고량 추정
export function calculateStockpile(answers: Answers): {
  lipsticks: number;
  skincareBottles: number;
} {
  const monthlyCosmetics = answers.makeupSpending;
  const monthlySkincare = answers.skincareSpending;
  
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
  // totalBeautySpending은 만원 단위이므로 원 단위로 변환 (× 10000)
  return answers.totalBeautySpending * 10000 * 12 * 5;
}

// 숫자를 원화 형식으로 포맷팅
export function formatWon(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

