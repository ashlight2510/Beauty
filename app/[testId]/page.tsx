import { getAllTestIds } from '@/lib/generate';
import TestIntroClient from './TestIntroClient';

export async function generateStaticParams() {
  const testIds = getAllTestIds();
  return testIds.map((id) => ({
    testId: id,
  }));
}

export default function TestIntroPage({ params }: { params: { testId: string } }) {
  return <TestIntroClient testId={params.testId} />;
}
