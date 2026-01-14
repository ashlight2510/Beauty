'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import ResultBox from '@/components/ResultBox';
import { AdComponent } from '@/lib/ads';
import { TestConfig, TestResult } from '@/lib/types';
import { getTestConfig } from '@/lib/generate';
import { convertAnswersToValues, calculate, formatWon } from '@/lib/scoring';
import { MORE_TESTS_URL } from '@/lib/constants';
import { Language, detectLang, t } from '@/lib/i18n';
import LangSwitch from '@/components/LangSwitch';

function ResultContent({ testId }: { testId: string }) {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('ko');
  const actionButtonClass =
    'w-full sm:flex-1 inline-flex items-center justify-center font-bold py-4 px-8 rounded-full text-center min-h-[56px] transition-colors';

  useEffect(() => {
    setCurrentLang(detectLang());
  }, []);

  useEffect(() => {
    if (!config) {
      try {
        const testConfig = getTestConfig(testId);
        setConfig(testConfig);
      } catch (error) {
        console.error('Failed to load test config:', error);
      }
      return;
    }

    try {
      // URL 파라미터에서 답변 가져오기
      const choices: Record<string, string> = {};
      config.questions.forEach((q) => {
        const value = searchParams.get(q.id);
        if (value) choices[q.id] = value;
      });

      // 답변이 없으면 홈으로 리다이렉트
      if (Object.keys(choices).length === 0) {
        window.location.href = `/${testId}`;
        return;
      }

      // 답변을 숫자 값으로 변환
      const answers = convertAnswersToValues(choices, config.questions);

      // 계산 수행
      const testResult = calculate(
        config.scoringMethod,
        answers,
        currentLang === 'en' ? ((config as any).resultMessagesEn || config.resultMessages) : config.resultMessages,
        currentLang
      );

      setResult(testResult);
    } catch (error) {
      console.error('Failed to calculate result:', error);
    }
  }, [searchParams, testId, config, currentLang]);

  if (!config || !result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('calculating', currentLang)}</p>
        </div>
      </main>
    );
  }

  const gradeKey = result.grade.grade;
  const gradeDescKey = result.grade.description;

  const displayGrade = currentLang === 'en' ? getGradeTranslation(gradeKey, currentLang) : result.grade.grade;
  const displayGradeDesc = currentLang === 'en' ? getGradeDescTranslation(gradeDescKey, currentLang) : result.grade.description;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <LangSwitch currentLang={currentLang} onLangChange={setCurrentLang} />
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8 animate-bounce-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t('testResult', currentLang)}
          </h1>
        </div>

        {/* 위험도 등급 */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-8 md:p-12 text-white mb-8 shadow-2xl animate-slide-up">
          <div className="text-center">
            <p className="text-lg md:text-xl mb-4">{t('yourRiskGrade', currentLang)}</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {displayGrade}
            </h2>
            <p className="text-lg md:text-xl opacity-90">{displayGradeDesc}</p>
            <div className="mt-6 text-3xl font-bold">
              {Math.round(result.riskScore)}{t('points', currentLang)}
            </div>
          </div>
        </div>

        {/* 결과 박스들 */}
        <div className="space-y-6 mb-8">
          <ResultBox
            title={t('beautyRatio', currentLang)}
            value={`${currentLang === 'en' ? 'Top' : '상위'} ${100 - result.percentile}%`}
            description={t('percentileDesc', currentLang)}
            color="text-purple-600"
          />

          <ResultBox
            title={t('stockpileTitle', currentLang)}
            value={`${currentLang === 'en' ? 'Lipsticks' : '립스틱'} ${result.stockpile.lipsticks}${currentLang === 'en' ? '' : '개'}`}
            description={`${t('stockpileDesc', currentLang)} ${result.stockpile.skincareBottles}${currentLang === 'en' ? ' ' + t('bottles', currentLang) : '병'}`}
            color="text-pink-600"
          />

          <ResultBox
            title={t('fiveYearTitle', currentLang)}
            value={formatWon(result.fiveYear, currentLang)}
            description={t('fiveYearDesc', currentLang)}
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
                alert(t('linkCopied', currentLang));
              }
            }}
            className={`${actionButtonClass} bg-blue-500 text-white shadow-lg hover:bg-blue-600`}
          >
            {t('shareResult', currentLang)}
          </button>
          <Link
            href={`/${testId}`}
            className={`${actionButtonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
          >
            {t('retakeTest', currentLang)}
          </Link>
          <a
            href={MORE_TESTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${actionButtonClass} bg-white border border-pink-100 text-pink-600 shadow hover:bg-pink-50 hover:border-pink-200`}
          >
            {t('otherTestsResult', currentLang)}
          </a>
        </div>

        {/* 광고 영역 */}
        <AdComponent />
      </div>
    </main>
  );
}

function getGradeTranslation(grade: string, lang: Language): string {
  const translations: Record<string, Record<Language, string>> = {
    '무소속 미니멀리스트': { ko: '무소속 미니멀리스트', en: 'Minimalist' },
    '꾸밈비 안정군': { ko: '꾸밈비 안정군', en: 'Stable Beauty Spender' },
    '주의군': { ko: '주의군', en: 'Caution Zone' },
    '고위험군': { ko: '고위험군', en: 'High Risk Zone' },
    '파산 확정 💸': { ko: '파산 확정 💸', en: 'Bankruptcy Confirmed 💸' },
  };
  return translations[grade]?.[lang] || grade;
}

function getGradeDescTranslation(desc: string, lang: Language): string {
  const translations: Record<string, Record<Language, string>> = {
    '당신은 뷰티 소비의 달인! 절제력이 뛰어나시네요.': { ko: '당신은 뷰티 소비의 달인! 절제력이 뛰어나시네요.', en: 'You are a master of beauty spending! Excellent self-control.' },
    '적당한 선에서 즐기시는 현명한 소비자입니다.': { ko: '적당한 선에서 즐기시는 현명한 소비자입니다.', en: 'You are a wise consumer who enjoys within reasonable limits.' },
    '조금만 더 신중하게 결정하시면 좋을 것 같아요.': { ko: '조금만 더 신중하게 결정하시면 좋을 것 같아요.', en: 'It would be good to make decisions a bit more carefully.' },
    '통장이 조금씩 울고 있어요. 한 번 점검해볼까요?': { ko: '통장이 조금씩 울고 있어요. 한 번 점검해볼까요?', en: 'Your wallet is crying a little. Shall we check it?' },
    '화장대에 난민촌이 생길 예정입니다. 지금 멈추세요!': { ko: '화장대에 난민촌이 생길 예정입니다. 지금 멈추세요!', en: 'A refugee camp will form on your vanity. Stop now!' },
  };
  return translations[desc]?.[lang] || desc;
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
