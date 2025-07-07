'use client';

import { CalendarData } from '@/services/calendar.service';
import type { Status } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { useCalendarActions, useCalendarStore } from '@/store/calendarStore';
import styled from '@emotion/styled';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { ParticipantList } from './ParticipantList';
import { RecommendationPanel } from './RecommendationPanel';

const PageWrapper = styled.div`
  background-color: #f9fafb;
  padding: 2rem;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const MainTitle = styled.h1`
  color: #111827; /* 더 진한 텍스트 색상 */
  margin-bottom: 0;
  font-size: 2.25rem; /* 더 큰 제목 */
`;

const InviteCode = styled.p`
  color: #6b7280;
  margin-top: 0.5rem;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;

  code {
    background-color: #e5e7eb;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }
`;

const LayoutGrid = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  align-items: flex-start;
`;

const CalendarSection = styled.section`
  flex: 1;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

const SidebarSection = styled.aside`
  flex: 0 0 250px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #6b7280;
`;

interface Props {
  initialData: CalendarData;
}

export default function CalendarClient({ initialData }: Props) {
  const queryClient = useQueryClient();
  const { clearSelection } = useCalendarActions();
  const calendarId = initialData!.id;

  const { data: calendarData } = useQuery<CalendarData>({
    queryKey: ['calendar', calendarId],
    queryFn: async () => {
      const res = await fetch(`/api/calendars/${calendarId}`);
      if (!res.ok) throw new Error('Failed to fetch calendar data');

      return res.json();
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });

  // 클라이언트 상태: 상호작용을 위한 상태
  const [visibleMonth, setVisibleMonth] = useState(new Date(initialData.startDate));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // DB 업데이트를 위한 Mutation
  const mutation = useMutation({
    mutationFn: ({ dates, status }: { dates: string[]; status: Status }) =>
      fetch(`/api/calendars/${calendarId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dates, status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar', calendarId] });
      clearSelection();
    },
    onError: (error) => {
      alert(`저장에 실패했습니다: ${error.message}`);
    },
  });

  const handleStatusSubmit = (status: Status) => {
    const selectedDates = useCalendarStore.getState().selectedDates;
    if (selectedDates.size === 0) return;
    mutation.mutate({ dates: Array.from(selectedDates), status });
  };

  const handlePrevMonth = () => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const handleNextMonth = () => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!calendarData) return <div>로딩 중...</div>;

  return (
    <PageWrapper>
      <ContentContainer>
        <MainTitle>{calendarData.title}</MainTitle>
        <InviteCode>
          초대 코드: <code>{calendarData.inviteCode}</code>
        </InviteCode>

        <LayoutGrid>
          <CalendarSection>
            <CalendarHeader
              visibleMonth={visibleMonth}
              startDate={calendarData.startDate}
              endDate={calendarData.endDate}

              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onSubmitStatus={handleStatusSubmit}
              isSubmitting={mutation.isPending}
            />

            <CalendarGrid calendarData={calendarData} ref={scrollContainerRef} onMonthVisible={setVisibleMonth} />
          </CalendarSection>

          <SidebarSection>
            <ParticipantList participants={calendarData.participants} />
            <RecommendationPanel data={calendarData} />
          </SidebarSection>
        </LayoutGrid>
      </ContentContainer>
    </PageWrapper>
  );
}
