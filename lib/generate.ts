import { TestConfig } from './types';

// 동적 config 로더
export async function loadTestConfig(testId: string): Promise<TestConfig> {
  try {
    const config = await import(`@/tests/${testId}/config.json`);
    return config.default || config;
  } catch (error) {
    console.error(`Failed to load config for test: ${testId}`, error);
    throw new Error(`Test config not found: ${testId}`);
  }
}

// 특정 테스트의 config 가져오기 (동기 버전 - 클라이언트에서 사용)
export function getTestConfig(testId: string): TestConfig {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`@/tests/${testId}/config.json`);
  } catch (error) {
    throw new Error(`Test config not found: ${testId}`);
  }
}

// 모든 테스트 목록 (하드코딩 대신 동적으로 관리) 
// 새 테스트 추가 시 여기에 추가하거나, 빌드 스크립트로 자동 업데이트 가능
const KNOWN_TESTS = ['beauty-bankruptcy'];

// 모든 테스트 목록 가져오기
export function getAllTestIds(): string[] {
  // 실제로는 모든 테스트를 시도해서 존재하는 것만 반환
  return KNOWN_TESTS.filter((id) => {
    try {
      getTestConfig(id);
      return true;
    } catch {
      return false;
    }
  });
}

// 모든 테스트의 기본 정보 가져오기
export function getAllTests(): Array<{ id: string; title: string; description: string }> {
  return getAllTestIds()
    .map((id) => {
      try {
        const config = getTestConfig(id);
        return {
          id,
          title: config.title,
          description: config.description,
        };
      } catch (error) {
        console.error(`Failed to load config for ${id}:`, error);
        return null;
      }
    })
    .filter((test): test is { id: string; title: string; description: string } => test !== null);
}
