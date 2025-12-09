import { getAllTestIds } from '@/lib/generate';
import TestClient from './TestClient';

export async function generateStaticParams() {
  const testIds = getAllTestIds();
  return testIds.map((id) => ({
    testId: id,
  }));
}

export default function TestPage({ params }: { params: { testId: string } }) {
  return <TestClient testId={params.testId} />;
}
