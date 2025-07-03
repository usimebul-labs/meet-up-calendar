'use client';

import React from 'react';
import { addMonths, format, subMonths } from 'date-fns';
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
  onPrevMonth: () => void; // onMonthChange -> onPrevMonth
  onNextMonth: () => void; // onMonthChange -> onNextMonth
  onSubmitStatus: (status: Status) => void;
  isSubmitting: boolean;
};

export function CalendarHeader({ visibleMonth, onPrevMonth, onNextMonth, onSubmitStatus, isSubmitting }: CalendarHeaderProps) {
  const selectedDates = useCalendarStore((state) => state.selectedDates);
  const isActionDisabled = isSubmitting || selectedDates.size === 0;

  return (
    <HeaderContainer>
      <MonthNavigator>
        <button onClick={onPrevMonth}>{"<"}</button>
        <MonthTitle>{format(visibleMonth, 'yyyy년 M월')}</MonthTitle>
        <button onClick={onNextMonth}>{">"}</button>
      </MonthNavigator>
      <ActionButtons>
        <StyledButton onClick={() => onSubmitStatus('AVAILABLE')} disabled={isActionDisabled}>
          가능
        </StyledButton>
        <StyledButton onClick={() => onSubmitStatus('PREFERRED')} disabled={isActionDisabled}>
          선호
        </StyledButton>
        <StyledButton onClick={() => onSubmitStatus('UNAVAILABLE')} disabled={isActionDisabled}>
          불가능
        </StyledButton>
      </ActionButtons>
    </HeaderContainer>
  );
}
