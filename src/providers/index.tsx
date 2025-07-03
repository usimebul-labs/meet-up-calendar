'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // 1. Devtools 임포트
import { SessionProvider } from 'next-auth/react';
import React, { useState } from 'react';
import StyleRegistry from './StyleRegistry';

type Props = {
  children?: React.ReactNode;
};

export default function Providers({ children }: Props) {
  // QueryClient 인스턴스를 컴포넌트의 생명주기 동안 한 번만 생성하기 위해
  // useState를 사용합니다. 이렇게 하지 않으면 매 렌더링마다 인스턴스가
  // 재생성되어 캐시가 유지되지 않습니다.
  const [queryClient] = useState(() => new QueryClient());

  return (
    // SessionProvider와 QueryClientProvider를 함께 설정합니다.
    // Provider의 순서는 크게 중요하지 않지만, 일반적으로 SessionProvider가
    // 바깥에 있는 경우가 많습니다.
    <StyleRegistry>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </StyleRegistry>
  );
}
