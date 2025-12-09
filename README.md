# 🎯 테스트 템플릿 프로젝트

재사용 가능한 테스트 생성 템플릿입니다. JSON 설정 파일만으로 새로운 테스트를 자동 생성할 수 있습니다.

## 🚀 시작하기

### 설치

```bash
yarn install
```

### 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
yarn build
```

### 프로덕션 실행

```bash
yarn start
```

## 📁 프로젝트 구조

```
Beauty/
├── app/
│   ├── page.tsx                    # 메인 페이지 (테스트 목록)
│   ├── [testId]/
│   │   ├── page.tsx                # 테스트 인트로 페이지
│   │   ├── test/
│   │   │   └── page.tsx            # 질문 페이지 (동적)
│   │   └── result/
│   │       └── page.tsx           # 결과 페이지 (동적)
│   ├── layout.tsx                  # 루트 레이아웃
│   └── globals.css                 # 전역 스타일
├── components/
│   ├── ProgressBar.tsx             # 진행 표시줄
│   ├── QuestionCard.tsx            # 질문 카드
│   └── ResultBox.tsx               # 결과 박스
├── lib/
│   ├── types.ts                    # 타입 정의
│   ├── generate.ts                 # 동적 config 로더
│   ├── scoring.ts                  # 스코어링 로직
│   └── ads.ts                      # 광고 시스템
├── tests/
│   └── beauty-bankruptcy/
│       └── config.json             # 테스트 설정 파일
├── scripts/
│   └── create-test.ts              # 테스트 자동 생성 스크립트
└── package.json
```

## 🎯 주요 기능

### 템플릿 기반 구조
- **동적 라우팅**: `/[testId]` 경로로 각 테스트 접근
- **JSON 기반 설정**: 모든 질문과 선택지를 `config.json`에서 관리
- **재사용 가능한 컴포넌트**: 새로운 테스트 추가 시 코드 수정 불필요

### 현재 포함된 테스트
- **꾸밈비 파산 위험도 테스트** (`/beauty-bankruptcy`)
  - 11개의 질문으로 뷰티 지출 패턴 분석
  - 위험도 등급, 퍼센타일, 재고량, 5년 지출 예측

## 🛠️ 새 테스트 생성하기

### 방법 1: 자동 생성 스크립트 사용

```bash
yarn create-test <test-id> "<Test Title>"
```

예시:
```bash
yarn create-test coffee-addiction "커피 중독도 테스트"
```

이 명령어는:
1. `tests/coffee-addiction/config.json` 생성
2. 기본 질문 템플릿 복사
3. `lib/generate.ts` 자동 업데이트

### 방법 2: 수동 생성

1. `tests/{test-id}/config.json` 파일 생성
2. 다음 구조로 작성:

```json
{
  "id": "test-id",
  "title": "테스트 제목",
  "description": "테스트 설명",
  "scoringMethod": "beauty_default",
  "questions": [
    {
      "id": "question1",
      "title": "질문 1",
      "choices": [
        { "label": "선택지 1", "value": 1 },
        { "label": "선택지 2", "value": 2 }
      ]
    }
  ],
  "resultMessages": ["메시지 1", "메시지 2"]
}
```

3. `lib/generate.ts`의 `getTestConfig` 함수에 케이스 추가
4. 필요시 `lib/scoring.ts`에 새로운 `scoringMethod` 추가

## 📝 Config.json 구조

```typescript
{
  id: string;                    // 테스트 ID (URL 경로)
  title: string;                 // 테스트 제목
  subtitle?: string;             // 부제목 (선택)
  description: string;            // 설명
  subDescription?: string;       // 부설명 (선택)
  scoringMethod: string;         // 스코어링 방법 ('beauty_default' 등)
  shareImage?: string;           // 공유 이미지 경로
  questions: Question[];         // 질문 배열
  resultMessages?: string[];    // 결과 메시지 배열
}
```

## 🎨 커스터마이징

### 새로운 스코어링 방법 추가

`lib/scoring.ts`의 `calculate` 함수에 새로운 `scoringMethod` 케이스를 추가하세요:

```typescript
if (scoringMethod === 'my_custom_method') {
  riskScore = myCustomCalculation(answers);
}
```

### 광고 시스템 설정

`lib/ads.ts`에서 `AD_PROVIDER`를 변경하거나 환경변수로 설정:

```typescript
export const AD_PROVIDER: AdProvider = 
  process.env.NEXT_PUBLIC_AD_PROVIDER as AdProvider || 'none';
```

## 🛠️ 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

## 📦 배포

Vercel에 배포하기:

1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com)에 연결
3. 자동 배포 완료!

## 🚀 향후 확장 가능 기능

- [ ] 자동 GitHub repo 생성
- [ ] Vercel 자동 배포 스크립트
- [ ] AdSense/AdFit 자동 스위치
- [ ] 테스트 통계 대시보드
- [ ] 다국어 지원

## 📝 라이선스

MIT
