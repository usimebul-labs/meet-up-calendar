'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize.xxl}px;
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: 40px;
  color: ${colors.text.primary};
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 320px;
  height: 50px;
  margin-bottom: 12px;
  border-radius: 12px;
  font-size: ${typography.fontSize.md}px;
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border: 1px solid ${colors.border};

  &:hover {
    opacity: 0.9;
  }

  svg {
    margin-right: 12px;
  }
`;

const GoogleButton = styled(LoginButton)`
  background-color: ${colors.surface};
  color: ${colors.text.primary};
`;

const KakaoButton = styled(LoginButton)`
  background-color: #FEE500;
  color: #000000;
  border: none;
`;

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Title>로그인</Title>
      <GoogleButton onClick={() => signIn('google', { callbackUrl: '/' })}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h24v24H1z" fill="none"/></svg>
        Google 계정으로 로그인
      </GoogleButton>
      <KakaoButton onClick={() => signIn('kakao', { callbackUrl: '/' })}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c-5.523 0-10 3.582-10 8 0 2.923 1.933 5.515 4.783 6.945l-1.11 3.665 3.99-2.095c.78.13 1.585.205 2.417.205 5.523 0 10-3.582 10-8s-4.477-8-10-8z" fill="#000000"/></svg>
        Kakao 계정으로 로그인
      </KakaoButton>
    </Container>
  );
}
