'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TestConfig } from '@/lib/types';
import { getTestConfig } from '@/lib/generate';
import { MORE_TESTS_URL } from '@/lib/constants';
import { Language, detectLang, setLang, t } from '@/lib/i18n';
import LangSwitch from '@/components/LangSwitch';

export default function TestIntroClient({ testId }: { testId: string }) {
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('ko');

  useEffect(() => {
    setCurrentLang(detectLang());
    try {
      const testConfig = getTestConfig(testId);
      setConfig(testConfig);
    } catch (error) {
      console.error('Failed to load test config:', error);
    }
  }, [testId]);

  if (!config) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading', currentLang)}</p>
        </div>
      </main>
    );
  }

  const displayTitle = currentLang === 'en' ? ((config as any).titleEn || config.title) : config.title;
  const displayDescription = currentLang === 'en' ? ((config as any).descriptionEn || config.description) : config.description;
  const displaySubDescription = currentLang === 'en' ? ((config as any).subDescriptionEn || config.subDescription) : config.subDescription;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <LangSwitch currentLang={currentLang} onLangChange={setCurrentLang} />
      <div className="max-w-2xl w-full text-center animate-bounce-in">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            💄 {displayTitle}
          </h1>
          {config.subtitle && (
            <p className="text-xl md:text-2xl text-gray-600 mb-2">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-8">
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
            {displayDescription}
          </p>
          {displaySubDescription && (
            <p className="text-sm md:text-base text-gray-500 mb-8">
              {displaySubDescription}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <Link
            href={`/${testId}/test`}
            className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-h-[56px]"
          >
            {t('testStart', currentLang)}
          </Link>
          <a
            href={MORE_TESTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-pink-600 text-lg font-semibold py-4 px-10 rounded-full border border-pink-100 shadow hover:bg-pink-50 hover:border-pink-200 transition-all duration-200 min-h-[56px]"
          >
            {t('otherTests', currentLang)}
          </a>
        </div>

        <div className="mt-12 text-sm text-gray-400">
          <p>{t('resultDisclaimer', currentLang)}</p>
        </div>
      </div>
    </main>
  );
}
