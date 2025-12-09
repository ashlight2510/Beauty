// 퍼센타일 계산 (단순 추정)
// 실제로는 더 정교한 통계 데이터가 필요하지만, 여기서는 위험도 점수 기반으로 추정

export function calculatePercentile(riskScore: number): number {
  // 위험도 점수를 기반으로 상위 퍼센트 추정
  // 점수가 높을수록 상위 퍼센트가 높음
  
  if (riskScore <= 15) {
    // 하위 20% (절약형)
    return 20;
  } else if (riskScore <= 35) {
    // 하위 20-50%
    return 50;
  } else if (riskScore <= 55) {
    // 중간 50-70%
    return 70;
  } else if (riskScore <= 75) {
    // 상위 70-90%
    return 90;
  } else {
    // 상위 90-100%
    return 95;
  }
}

