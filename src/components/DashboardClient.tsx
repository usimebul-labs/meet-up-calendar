'use client';

import styled from '@emotion/styled';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import type { CalendarWithParticipant } from '@/app/page'; // 서버 컴포넌트에서 export한 타입
import { CreateCalendarForm } from './CreateCalendarForm';
import { JoinByInviteCode } from './JoinByInviteCode';
import { CalendarList } from './CalendarList';

const PageWrapper = styled.div`
  background-color: #f9fafb;
  padding: 2rem;
  min-height: calc(100vh - 65px); /* 헤더 높이를 뺀 나머지 */
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  color: #111827;
  margin-bottom: 2rem;
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row; /* 사이드바를 오른쪽으로 보내기 위해 순서 뒤집기 */
  gap: 2rem;
  align-items: flex-start;
`;

const MainContent = styled.main`
  flex: 1; /* 남은 공간을 모두 차지 */
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.aside`
  flex: 0 0 420px; /* 사이드바 너비 고정 */
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// 간단한 스타일
const containerStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '2rem auto',
  padding: '2rem',
  fontFamily: 'sans-serif',
};
const cardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};
const inputStyle: React.CSSProperties = {
  padding: '0.8rem',
  marginRight: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '200px',
};
const buttonStyle: React.CSSProperties = {
  padding: '0.8rem 1.5rem',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
};

// 서버 컴포넌트로부터 받을 props의 타입을 정의합니다.
interface DashboardClientProps {
  initialCalendars: CalendarWithParticipant[];
  user: Session['user'];
}

export default function DashboardClient({ initialCalendars, user }: DashboardClientProps) {
  const [calendars, setCalendars] = useState(initialCalendars);
  const [newCalendarTitle, setNewCalendarTitle] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 1-1. 캘린더 클릭 시 해당 상세 페이지로 이동
  const handleCalendarClick = (calendarId: string) => {
    router.push(`/calendar/${calendarId}`);
  };

  // 삭제 성공 시 호출될 콜백 함수
  const handleDeleteSuccess = (deletedCalendarId: string) => {
    // 기존 캘린더 목록에서 삭제된 캘린더를 제외하고 상태를 업데이트
    setCalendars((prevCalendars) => prevCalendars.filter((cal) => cal.id !== deletedCalendarId));
  };

  return (
    <PageWrapper>
      <ContentContainer>
        <DashboardTitle>{user.name}님, 환영합니다!</DashboardTitle>

        <LayoutContainer>
          <MainContent>
            <CreateCalendarForm />
            <JoinByInviteCode />
          </MainContent>

          <Sidebar>
            <CalendarList
              calendars={calendars}
              onCalendarClick={handleCalendarClick}
              onDeleteSuccess={handleDeleteSuccess} // 콜백 함수 전달
            />
          </Sidebar>
        </LayoutContainer>
      </ContentContainer>
    </PageWrapper>
  );
}
