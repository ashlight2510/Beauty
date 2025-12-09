// 공통 타입 정의

export interface QuestionChoice {
  label: string;
  value: number;
}

export interface Question {
  id: string;
  title: string;
  choices: QuestionChoice[];
}

export interface TestConfig {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  subDescription?: string;
  scoringMethod: string;
  shareImage?: string;
  questions: Question[];
  resultMessages?: string[];
}

export interface Answers {
  [key: string]: number;
}

export interface RiskGrade {
  grade: string;
  description: string;
  color: string;
}

export interface Stockpile {
  lipsticks: number;
  skincareBottles: number;
}

export interface TestResult {
  riskScore: number;
  grade: RiskGrade;
  percentile: number;
  stockpile: Stockpile;
  fiveYear: number;
  message: string;
}

