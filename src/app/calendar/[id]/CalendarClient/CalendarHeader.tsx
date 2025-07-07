'use client';

import React from 'react';
import { addMonths, format, isSameMonth, subMonths } from 'date-fns';
import { useCalendarStore } from '@/store/calendarStore';
import type { Status } from '@prisma/client';
import styled from '@emotion/styled';

const HeaderContainer = styled.div`
  // ...
`;

const MonthNavigator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
`;

const MonthNavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%; /* 원형 버튼 */
  border: none;
  background-color: transparent;
  color: #6b7280; /* text-gray-500 */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 1.5rem; /* 아이콘 크기 조정 */
  line-height: 1;

  &:hover:not(:disabled) {
    background-color: #f3f4f6; /* gray-100 */
    color: #111827; /* gray-900 */
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const MonthTitle = styled.h2`
  color: #374151;
  margin: 0;
`;

const ActionButtons = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
`;

const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover:not(:disabled) {
    background-color: #2563eb;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

type CalendarHeaderProps = {
  visibleMonth: Date; // currentMonth -> visibleMonth
  startDate: Date | string;
  endDate: Date | string;
  onPrevMonth: () => void; // onMonthChange -> onPrevMonth
  onNextMonth: () => void; // onMonthChange -> onNextMonth
  onSubmitStatus: (status: Status) => void;
  isSubmitting: boolean;
};

export function CalendarHeader({ visibleMonth, startDate, endDate, onPrevMonth, onNextMonth, onSubmitStatus, isSubmitting }: CalendarHeaderProps) {
  const selectedDates = useCalendarStore((state) => state.selectedDates);
  const isActionDisabled = isSubmitting || selectedDates.size === 0;

  // 현재 보이는 월이 캘린더의 시작 월과 같은지 확인
  const isPrevDisabled = isSameMonth(visibleMonth, new Date(startDate));
  // 현재 보이는 월이 캘린더의 종료 월과 같은지 확인
  const isNextDisabled = isSameMonth(visibleMonth, new Date(endDate));

  return (
    <HeaderContainer>
      <ActionButtons>
        <StyledButton onClick={() => onSubmitStatus('AVAILABLE')} disabled={isActionDisabled}>
          참석
        </StyledButton>
        <StyledButton onClick={() => onSubmitStatus('PREFERRED')} disabled={isActionDisabled}>
          선호
        </StyledButton>
        <StyledButton onClick={() => onSubmitStatus('UNAVAILABLE')} disabled={isActionDisabled}>
          불참
        </StyledButton>
      </ActionButtons>
      <MonthNavigator>
        <MonthNavButton onClick={onPrevMonth} disabled={isPrevDisabled} aria-label="Previous month">
          ‹
        </MonthNavButton>
        <MonthTitle>{format(visibleMonth, 'yyyy년 M월')}</MonthTitle>
        <MonthNavButton onClick={onNextMonth} disabled={isNextDisabled} aria-label="Next month">
          ›
        </MonthNavButton>
      </MonthNavigator>
    </HeaderContainer>
  );
}
