'use client';

import { CalendarData } from '@/services/calendar.service';
import { useCalendarActions, useCalendarStore } from '@/store/calendarStore';
import { getUserColor } from '@/utils/colorUtils';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { Response as ResponseType, Status } from '@prisma/client';
import { format, isToday } from 'date-fns';
import React from 'react';

const CellContainer = styled.div<{ isSelectable: boolean; isSelected: boolean }>`
  min-height: 120px;
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease-in-out;
  position: relative;
  background-color: ${(props) => (props.isSelected ? '#dbeafe' : '#ffffff')};

  &:hover {
    background-color: ${(props) => (props.isSelected ? '#dbeafe' : '#f9fafb')};
  }

  ${(props) =>
    !props.isSelectable &&
    css`
      background-color: #f3f4f6;
      cursor: not-allowed;
      &:hover {
        background-color: #f3f4f6;
      }
    `}
`;

const DateNumber = styled.span<{ isToday: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.875rem;

  ${(props) =>
    props.isToday &&
    css`
      background-color: #3b82f6;
      color: #ffffff;
      font-weight: bold;
    `}
`;

const ResponseContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 8px;
  left: 8px;
`;

const ResponseIndicator = styled.div<{ color: string; status: Status; index: number }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  background-color: ${(props) => props.color};
  margin-left: ${(props) => (props.index === 0 ? '0' : '-6px')};

  ${(props) =>
    props.status === 'UNAVAILABLE' &&
    css`
      opacity: 0.3;
    `}
  ${(props) =>
    props.status === 'PREFERRED' &&
    css`
      box-shadow: 0 0 0 2px gold, 0 1px 2px 0 rgb(0 0 0 / 0.05);
    `}
`;

type CalendarCellProps = {
  day: Date;
  responses: ResponseType[];
  participants: CalendarData['participants'];
  availableDays: number[];
};

export function CalendarCell({ day, responses, participants, availableDays }: CalendarCellProps) {
  const dateStr = format(day, 'yyyy-MM-dd');
  const isSelected = useCalendarStore((state) => state.selectedDates.has(dateStr));
  const { toggleDateSelection } = useCalendarActions();

  const cellStyle: React.CSSProperties = {
    height: '120px',
    border: '1px solid #eee',
    padding: '0.5rem',
    backgroundColor: isSelected ? '#aadeff' : 'white',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const isSelectable = availableDays.includes(day.getDay());

  return (
    <CellContainer isSelectable={isSelectable} isSelected={isSelected} onClick={() => isSelectable && toggleDateSelection(dateStr)}>
      <DateNumber isToday={isToday(day)}>{format(day, 'd')}</DateNumber>
      <ResponseContainer>
        {responses.map((res, index) => (
          <ResponseIndicator
            key={res.id}
            index={index}
            color={getUserColor(res.userId)}
            status={res.status}
            title={participants.find((p) => p.userId === res.userId)?.user.name || 'Unknown'}
          />
        ))}
      </ResponseContainer>
    </CellContainer>
  );
}