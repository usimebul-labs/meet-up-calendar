'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

// --- Styled Components ---

const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  color: #374151;
  margin: 0;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const InviteInput = styled.input`
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;

  &:focus {
    outline: 2px solid #3b82f6;
    border-color: transparent;
  }
`;

const JoinButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background-color: #10b981; /* Green color for join action */
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background-color: #059669;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// --- Component ---

export function JoinByInviteCode() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      alert('초대 코드를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/calendars/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '참여에 실패했습니다.');
      }

      const joinedCalendar = await res.json();
      alert('캘린더에 성공적으로 참여했습니다!');
      router.push(`/calendar/${joinedCalendar.id}`);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <SectionTitle>🤝 초대 코드로 참여하기</SectionTitle>
      <InputGroup>
        <InviteInput type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="초대 코드 입력" disabled={isLoading} />
        <JoinButton onClick={handleJoin} disabled={isLoading}>
          {isLoading ? '참여 중...' : '참여'}
        </JoinButton>
      </InputGroup>
    </FormContainer>
  );
}
