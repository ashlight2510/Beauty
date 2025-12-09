#!/usr/bin/env node

/**
 * 테스트 자동 생성 스크립트
 * Usage: yarn create-test <test-id> "<Test Title>"
 * Example: yarn create-test coffee-addiction "커피 중독도 테스트"
 */

import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: yarn create-test <test-id> "<Test Title>"');
  console.error('Example: yarn create-test coffee-addiction "커피 중독도 테스트"');
  process.exit(1);
}

const [testId, title] = args;

// testId 검증
if (!/^[a-z0-9-]+$/.test(testId)) {
  console.error('Error: test-id는 소문자, 숫자, 하이픈만 사용할 수 있습니다.');
  process.exit(1);
}

const projectRoot = path.join(__dirname, '..');
const testDir = path.join(projectRoot, 'tests', testId);
const templateConfigPath = path.join(projectRoot, 'tests', 'beauty-bankruptcy', 'config.json');

// 템플릿 config 읽기
if (!fs.existsSync(templateConfigPath)) {
  console.error(`Error: 템플릿 config를 찾을 수 없습니다: ${templateConfigPath}`);
  process.exit(1);
}

const templateConfig = JSON.parse(fs.readFileSync(templateConfigPath, 'utf-8'));

// 새 config 생성
const newConfig = {
  ...templateConfig,
  id: testId,
  title: title,
  subtitle: `${title} Test`,
  description: `${title}에 대한 설명을 입력하세요.`,
  subDescription: `총 ${templateConfig.questions.length}개의 질문으로 알아보는 테스트입니다.`,
  scoringMethod: 'beauty_default', // 기본값, 나중에 수정 가능
  questions: templateConfig.questions.map((q: any) => ({
    ...q,
    title: q.title.replace('Q1.', `Q${templateConfig.questions.indexOf(q) + 1}.`),
  })),
  resultMessages: [
    '테스트 결과 메시지 1',
    '테스트 결과 메시지 2',
    '테스트 결과 메시지 3',
  ],
};

// 디렉토리 생성
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
  console.log(`✅ Created directory: tests/${testId}`);
} else {
  console.error(`Error: tests/${testId} 디렉토리가 이미 존재합니다.`);
  process.exit(1);
}

// config.json 생성
const configPath = path.join(testDir, 'config.json');
fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');
console.log(`✅ Created config.json: tests/${testId}/config.json`);

// generate.ts의 KNOWN_TESTS 배열에 새 테스트 추가
const generatePath = path.join(projectRoot, 'lib', 'generate.ts');
if (fs.existsSync(generatePath)) {
  let generateContent = fs.readFileSync(generatePath, 'utf-8');
  
  // KNOWN_TESTS 배열에 새 테스트 추가
  const knownTestsPattern = /const KNOWN_TESTS = \[(.*?)\];/s;
  const match = generateContent.match(knownTestsPattern);
  if (match) {
    const existingTests = match[1]
      .split(',')
      .map((t) => t.trim().replace(/['"]/g, ''))
      .filter((t) => t);
    
    if (!existingTests.includes(testId)) {
      existingTests.push(testId);
      const newTestsArray = `const KNOWN_TESTS = [${existingTests.map((t) => `'${t}'`).join(', ')}];`;
      generateContent = generateContent.replace(knownTestsPattern, newTestsArray);
      fs.writeFileSync(generatePath, generateContent, 'utf-8');
      console.log(`✅ Updated lib/generate.ts`);
    }
  } else {
    // 패턴을 찾지 못한 경우, 수동으로 추가 시도
    const fallbackPattern = /const KNOWN_TESTS = \[.*?\];/;
    if (fallbackPattern.test(generateContent)) {
      console.log(`⚠️  KNOWN_TESTS 패턴을 찾지 못했습니다. 수동으로 추가해주세요.`);
    }
  }
}

console.log('\n🎉 테스트 생성 완료!');
console.log(`\n다음 단계:`);
console.log(`1. tests/${testId}/config.json 파일을 수정하여 질문과 선택지를 커스터마이징하세요.`);
console.log(`2. 필요시 lib/scoring.ts에 새로운 scoringMethod를 추가하세요.`);
console.log(`3. 브라우저에서 /${testId} 경로로 접속하여 테스트를 확인하세요.`);
console.log(`\n테스트 URL: http://localhost:3000/${testId}`);

