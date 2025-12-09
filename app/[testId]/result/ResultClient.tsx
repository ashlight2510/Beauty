'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import ResultBox from '@/components/ResultBox';
import { AdComponent } from '@/lib/ads';
import { TestConfig, TestResult } from '@/lib/types';
import { getTestConfig } from '@/lib/generate';
import { convertAnswersToValues, calculate, formatWon } from '@/lib/scoring';

function ResultContent({ testId }: { testId: string }) {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    try {
      const testConfig = getTestConfig(testId);
      setConfig(testConfig);

      // URL 파라미터에서 답변 가져오기
      const choices: Record<string, string> = {};
      testConfig.questions.forEach((q) => {
        const value = searchParams.get(q.id);
        if (value) choices[q.id] = value;
      });

      // 답변이 없으면 홈으로 리다이렉트
      if (Object.keys(choices).length === 0) {
        window.location.href = `/${testId}`;
        return;
      }

      // 답변을 숫자 값으로 변환
      const answers = convertAnswersToValues(choices, testConfig.questions);

      // 계산 수행
      const testResult = calculate(
        testConfig.scoringMethod,
        answers,
        testConfig.resultMessages
      );

      setResult(testResult);
    } catch (error) {
      console.error('Failed to load test config or calculate result:', error);
    }
  }, [searchParams, testId]);

  if (!config || !result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">결과를 계산 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8 animate-bounce-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎯 테스트 결과
          </h1>
        </div>

        {/* 위험도 등급 */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-8 md:p-12 text-white mb-8 shadow-2xl animate-slide-up">
          <div className="text-center">
            <p className="text-lg md:text-xl mb-4">당신의 위험도 등급은</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {result.grade.grade}
            </h2>
            <p className="text-lg md:text-xl opacity-90">{result.grade.description}</p>
            <div className="mt-6 text-3xl font-bold">
              {Math.round(result.riskScore)}점
            </div>
          </div>
        </div>

        {/* 결과 박스들 */}
        <div className="space-y-6 mb-8">
          <ResultBox
            title="당신의 꾸밈비 비율"
            value={`상위 ${100 - result.percentile}%`}
            description="다른 사람들과 비교했을 때의 위치입니다"
            color="text-purple-600"
          />

          <ResultBox
            title="1년 후 예상 재고량"
            value={`립스틱 ${result.stockpile.lipsticks}개`}
            description={`반쯤 남은 스킨케어 제품 ${result.stockpile.skincareBottles}병`}
            color="text-pink-600"
          />

          <ResultBox
            title="5년 후 누적 지출"
            value={formatWon(result.fiveYear)}
            description="현재 패턴을 유지한다면 예상되는 총 지출입니다"
            color="text-red-600"
          />
        </div>

        {/* 병맛 멘트 */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8 animate-fade-in">
          <p className="text-lg font-semibold text-gray-800 text-center">
            💬 {result.message}
          </p>
        </div>

        {/* 공유하기 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: config.title,
                  text: `나의 위험도 등급: ${result.grade.grade}! 테스트 해보세요!`,
                  url: window.location.origin + `/${testId}`,
                });
              } else {
                // 클립보드에 복사
                navigator.clipboard.writeText(
                  `${window.location.origin}/${testId}?result=${result.grade.grade}`
                );
                alert('링크가 복사되었습니다!');
              }
            }}
            className="bg-blue-500 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
          >
            📤 결과 공유하기
          </button>
          <Link
            href={`/${testId}`}
            className="bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-full hover:bg-gray-300 transition-colors text-center"
          >
            🔄 다시 테스트하기
          </Link>
        </div>

        {/* 광고 영역 */}
        <AdComponent />
      </div>
    </main>
  );
}

export default function ResultClient({ testId }: { testId: string }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        </main>
      }
    >
      <ResultContent testId={testId} />
    </Suspense>
  );
}

