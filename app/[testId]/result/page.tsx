import { getAllTestIds } from '@/lib/generate';
import ResultClient from './ResultClient';

export async function generateStaticParams() {
  const testIds = getAllTestIds();
  return testIds.map((id) => ({
    testId: id,
  }));
}

export default function ResultPage({ params }: { params: { testId: string } }) {
  return <ResultClient testId={params.testId} />;
}
