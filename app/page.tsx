import { redirect } from 'next/navigation';

export default function Home() {
  // 메인 페이지에서 바로 뷰티 테스트로 리다이렉트
  redirect('/beauty-bankruptcy');
}
