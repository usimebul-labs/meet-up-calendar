'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  // useSession 훅으로 현재 로그인 상태를 가져옵니다.
  // data: 세션 정보 (로그인 시 user 객체 포함), status: "loading" | "authenticated" | "unauthenticated"
  const { data: session, status } = useSession();
  const router = useRouter();

  // 이미 로그인된 상태(authenticated)라면 메인 페이지로 리디렉션합니다.
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  // 로딩 중일 때 보여줄 UI (선택 사항)
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // 로그인되지 않은 상태일 때 로그인 버튼을 보여줍니다.
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <h1>로그인</h1>
      {/* 
        signIn 함수는 Next-Auth가 제공하는 클라이언트 측 함수입니다.
        첫 번째 인자로 프로바이더의 ID('google')를 전달합니다.
        두 번째 인자로 옵션을 전달할 수 있습니다. { callbackUrl: "/" }는
        로그인 성공 후 리디렉션될 경로를 지정합니다.
      */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Google 계정으로 로그인
      </button>
    </div>
  );
}
