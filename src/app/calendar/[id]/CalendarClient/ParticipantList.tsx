'use client';

import React from 'react';
import { getUserColor } from '@/utils/colorUtils';
import type { CalendarData } from '@/services/calendar.service';
import styled from '@emotion/styled';

const PanelContainer = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #374151;
`;

// --- 핵심 변경 부분 ---
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid; /* Flexbox 대신 Grid 사용 */
  grid-template-columns: repeat(2, 1fr); /* 2개의 동일한 너비의 컬럼 생성 */
  gap: 0.75rem 1rem; /* 세로(row) 0.75rem, 가로(column) 1rem 간격 */
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* 이름이 길 경우를 대비해 overflow 처리 */
  overflow: hidden; 
`;

const ColorDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  flex-shrink: 0; /* 이름이 길어져도 줄어들지 않도록 설정 */
`;

const Name = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
  white-space: nowrap; /* 줄바꿈 방지 */
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
  text-overflow: ellipsis; /* ...으로 표시 */
`;

type ParticipantListProps = {
  participants: CalendarData['participants'];
};

export function ParticipantList({ participants }: ParticipantListProps) {
  return (
    <PanelContainer>
      <Title>참여자 ({participants.length})</Title>
      <List>
        {participants.map(p => (
          <ListItem key={p.userId}>
            <ColorDot color={getUserColor(p.userId)} />
            <Name title={p.user?.name || ''}>{p.user?.name}</Name>
          </ListItem>
        ))}
      </List>
    </PanelContainer>
  );
}
