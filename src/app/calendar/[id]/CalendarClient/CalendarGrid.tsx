'use client';

import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, eachMonthOfInterval, isSameMonth } from 'date-fns';
import { CalendarCell } from './CalendarCell';
import type { CalendarData } from '@/services/calendar.service';

const ScrollWrapper = styled.div`
  overflow-x: auto;
  scroll-behavior: smooth;
  /* 스크롤 스냅 설정 */
  scroll-snap-type: x mandatory;
  display: flex;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const MonthContainer = styled.div`
  /* 각 월이 컨테이너 전체 너비를 차지하도록 설정 */
  flex: 0 0 100%;
  scroll-snap-align: start; /* 스크롤 스냅 정렬 지점 */
  padding: 0 1px; /* 미세한 간격 조정 */
`;

const MonthTitle = styled.h3`
  text-align: center;
  font-size: 1.25rem;
  color: #374151;
  margin: 1rem 0;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* 캘린더 셀 사이의 경계선을 border 대신 gap으로 처리하면 더 깔끔합니다. */
  gap: 1px;
  background-color: #e5e7eb; /* gap 사이를 채울 배경색 */
  border: 1px solid #e5e7eb;
  overflow: hidden; /* 둥근 모서리를 위해 */
  border-radius: 8px;
`;

const DayHeader = styled.div`
  text-align: center;
  padding: 0.75rem 0.5rem;
  font-weight: 600; /* semi-bold */
  font-size: 0.875rem; /* 14px */
  color: #6b7280; /* text-gray-500 */
  background-color: #ffffff;
`;

const EmptyCell = styled.div`
  background-color: #f9fafb;
  min-height: 120px;
`;

type CalendarGridProps = {
  calendarData: CalendarData;
  onMonthVisible: (month: Date) => void;
};

export const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(function CalendarGrid(props, ref) {
  const { calendarData, onMonthVisible } = props;
  const { startDate, endDate, availableDays, responses, participants } = calendarData;

  const monthRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const monthsToDisplay = useMemo(() => {
    return eachMonthOfInterval({ start: new Date(startDate), end: new Date(endDate) });
  }, [startDate, endDate]);

  useEffect(() => {
    const scrollContainer = (ref as React.RefObject<HTMLDivElement>)?.current;
    if (!scrollContainer) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const monthStr = (entry.target as HTMLDivElement).dataset.month;
            if (monthStr) {
              onMonthVisible(new Date(monthStr));
            }
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.7,
      }
    );

    const currentMonthRefs = monthRefs.current;
    currentMonthRefs.forEach((refEl) => observer.observe(refEl));

    return () => {
      currentMonthRefs.forEach((refEl) => observer.unobserve(refEl));
      observer.disconnect();
    };
  }, [monthsToDisplay, onMonthVisible, ref]); // 의존성 배열에 ref 추가

  const responsesByDate = useMemo(() => {
    const map = new Map<string, CalendarData['responses']>();
    responses.forEach((res) => {
      const dateKey = format(new Date(res.date), 'yyyy-MM-dd');
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(res);
    });

    return map;
  }, [responses]);
  return (
    // 여기서 전달받은 ref를 실제 DOM 요소에 연결합니다.
    <ScrollWrapper ref={ref}>
      {monthsToDisplay.map((month) => {
        const monthKey = month.toISOString();
        const daysInMonthGrid = eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) });

        return (
          <MonthContainer
            key={month.toISOString()}
            data-month={month.toISOString()}
            ref={(el) => {
              const monthKey = month.toISOString();
              if (el) monthRefs.current.set(monthKey, el);
              else monthRefs.current.delete(monthKey);
            }}
          >
            <GridContainer>
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <DayHeader key={day}>{day}</DayHeader>
              ))}
              {daysInMonthGrid.map((day) => {
                const isWithinRange = day >= new Date(startDate) && day <= new Date(endDate) && isSameMonth(day, month);
                if (!isWithinRange) return <EmptyCell key={day.toString()} />;

                return (
                  <CalendarCell
                    key={day.toString()}
                    day={day}
                    availableDays={availableDays}
                    responses={responsesByDate.get(format(day, 'yyyy-MM-dd')) || []}
                    participants={participants}
                  />
                );
              })}
            </GridContainer>
          </MonthContainer>
        );
      })}
    </ScrollWrapper>
  );
});
