'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import { TestConfig } from '@/lib/types';
import { getTestConfig } from '@/lib/generate';

export default function TestClient({ testId }: { testId: string }) {
  const router = useRouter();
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const testConfig = getTestConfig(testId);
      setConfig(testConfig);
    } catch (error) {
      console.error('Failed to load test config:', error);
    }
  }, [testId]);

  const handleSelect = (value: string) => {
    if (!config) return;
    
    const questionId = config.questions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // 마지막 질문이면 결과 페이지로 이동
    if (currentQuestion === config.questions.length - 1) {
      // URL 파라미터로 답변 전달
      const params = new URLSearchParams(newAnswers);
      router.push(`/${testId}/result?${params.toString()}`);
    } else {
      // 다음 질문으로
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  if (!config) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </main>
    );
  }

  const currentQ = config.questions[currentQuestion];
  const choices = currentQ.choices.map((c) => c.label);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <ProgressBar current={currentQuestion + 1} total={config.questions.length} />
        
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl">
          <QuestionCard
            question={currentQ.title}
            choices={choices}
            selectedValue={answers[currentQ.id]}
            onSelect={handleSelect}
          />
        </div>

        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="mt-6 text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 이전 질문
          </button>
        )}
      </div>
    </main>
  );
}

