"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

// 간단한 스타일 객체
const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #dee2e6',
};

const navLinksStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: 'white',
};

const userNameStyle: React.CSSProperties = {
  fontWeight: 'bold',
};

export default function Header() {
  // useSession 훅을 사용하여 세션 정보와 상태를 가져옵니다.
  const { data: session, status } = useSession();

  // status가 "loading"일 때는 아무것도 렌더링하지 않거나 로딩 스피너를 보여줄 수 있습니다.
  if (status === "loading") {
    return (
      <header style={headerStyle}>
        <div>로딩 중...</div>
      </header>
    );
  }

  return (
    <header style={headerStyle}>
      <Link href="/" style={{ textDecoration: 'none', color: 'black', fontSize: '1.5rem' }}>
        Meet-Up Scheduler
      </Link>
      <nav style={navLinksStyle}>
        {status === "authenticated" ? (
          <>
            {session.user?.name && <span style={userNameStyle}>{session.user.name} 님</span>}
            <button
              onClick={() => signOut({ callbackUrl: '/' })} // 로그아웃 후 메인 페이지로 이동
              style={buttonStyle}
            >
              로그아웃
            </button>
          </>
        ) : (
          // 로그아웃 상태일 때 보여줄 UI
          <Link href="/login">
            <button style={buttonStyle}>로그인</button>
          </Link>
        )}
      </nav>
    </header>
  );
}
