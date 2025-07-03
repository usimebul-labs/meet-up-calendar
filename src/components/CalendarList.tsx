'use client';

import styled from '@emotion/styled';
import { format } from 'date-fns';
import type { Calendar } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

// --- Styled Components ---

const Container = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  height: 100%; /* 부모 높이에 맞게 꽉 채움 */
`;

const Title = styled.h3`
  font-size: 1.25rem;
  color: #374151;
  margin-top: 0;
  margin-bottom: 1.5rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.li`
  /* ListItem을 flex container로 변경하여 내부 요소 정렬 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  /* hover 효과는 이제 자식 요소에서 처리 */
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  cursor: pointer;
  padding-right: 1rem; /* 삭제 버튼과의 간격 */
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  color: #ef4444; /* Red color for delete */
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background-color: #fee2e2; /* Light red background */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CalendarTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: #111827;
`;

const CalendarInfo = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
`;

const NoCalendarsText = styled.p`
  text-align: center;
  color: #9ca3af;
  padding: 4rem 0;
  font-size: 1rem;
`;

// --- Component ---

type CalendarListProps = {
  calendars: Calendar[];
  onCalendarClick: (id: string) => void;
  onDeleteSuccess: (id: string) => void; // 삭제 성공 시 부모에게 알릴 콜백
};

export function CalendarList({ calendars, onCalendarClick, onDeleteSuccess }: CalendarListProps) {
  const { data: session } = useSession(); // 현재 사용자 정보를 가져옴
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, calendarId: string) => {
    e.stopPropagation(); // 이벤트 버블링 방지 (ListItem의 onClick이 실행되지 않도록)

    if (!window.confirm('정말로 이 캘린더를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setDeletingId(calendarId);
    try {
      const res = await fetch(`/api/calendars/${calendarId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '삭제에 실패했습니다.');
      }

      alert('캘린더가 삭제되었습니다.');
      onDeleteSuccess(calendarId); // 부모 컴포넌트에 삭제된 ID를 알려줌
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container>
      <Title>🗓️ 참여 중인 캘린더</Title>
      {calendars.length > 0 ? (
        <List>
          {calendars.map((cal) => {
            // 현재 사용자가 캘린더의 소유자인지 확인
            const isOwner = session?.user?.id === cal.ownerId;
            const isDeleting = deletingId === cal.id;

            return (
              <ListItem key={cal.id}>
                <ContentWrapper onClick={() => onCalendarClick(cal.id)}>
                  <CalendarTitle>{cal.title}</CalendarTitle>
                  <CalendarInfo>
                    기간: {format(new Date(cal.startDate), 'yyyy.MM.dd')} ~ {format(new Date(cal.endDate), 'yyyy.MM.dd')}
                  </CalendarInfo>
                </ContentWrapper>

                {isOwner && (
                  <DeleteButton onClick={(e) => handleDelete(e, cal.id)} disabled={isDeleting}>
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </DeleteButton>
                )}
              </ListItem>
            );
          })}
        </List>
      ) : (
        <NoCalendarsText>
          아직 참여 중인 캘린더가 없습니다.
          <br />
          새로운 캘린더를 만들거나 코드로 참여해보세요!
        </NoCalendarsText>
      )}
    </Container>
  );
}
