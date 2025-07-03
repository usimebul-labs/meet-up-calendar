import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DatePickerPopover } from './DatePickerPopover';

// --- Styled Components ---

const FormContainer = styled.form`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div``;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  color: #374151;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const SectionLabel = styled.h4`
  font-size: 1rem;
  color: #374151;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  &:focus {
    outline: 2px solid #3b82f6;
    border-color: transparent;
  }
`;

const DatePickersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const WeekdaySelector = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const WeekdayLabel = styled.label<{ checked: boolean }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(props) => (props.checked ? '#3b82f6' : '#d1d5db')};
  background-color: ${(props) => (props.checked ? '#dbeafe' : 'transparent')};
  color: ${(props) => (props.checked ? '#1e40af' : '#374151')};
  font-weight: 500;

  input {
    display: none;
  }
`;

const SubmitButton = styled.button`
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

const WEEKDAYS = [
  { label: '일', value: 0 },
  { label: '월', value: 1 },
  { label: '화', value: 2 },
  { label: '수', value: 3 },
  { label: '목', value: 4 },
  { label: '금', value: 5 },
  { label: '토', value: 6 },
];

export function CreateCalendarForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [deadline, setDeadline] = useState<Date>();
  const [selectedWeekdays, setSelectedWeekdays] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]));
  const [isLoading, setIsLoading] = useState(false);

  const handleWeekdayChange = (dayValue: number) => {
    setSelectedWeekdays((prev) => {
      const next = new Set(prev);
      if (next.has(dayValue)) next.delete(dayValue);
      else next.add(dayValue);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate || selectedWeekdays.size === 0) {
      alert('제목, 시작일, 종료일, 가능 요일은 필수입니다.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/calendars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          startDate: startDate,
          endDate: endDate,
          deadline: deadline,
          availableDays: Array.from(selectedWeekdays),
        }),
      });
      if (!res.ok) throw new Error('캘린더 생성 실패');
      const newCalendar = await res.json();
      router.push(`/calendar/${newCalendar.id}`);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <SectionTitle>🤝 캘린더 생성하기</SectionTitle>
      <Section>
        <TitleInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="스터디, 프로젝트, 회의 등" required />
        <SectionLabel>기간 설정</SectionLabel>
        <DatePickersContainer>
          <DatePickerPopover placeholder="시작일을 선택하세요" selected={startDate} onSelect={setStartDate} disabled={{ before: new Date() }} />
          <DatePickerPopover placeholder="종료일을 선택하세요" selected={endDate} onSelect={setEndDate} disabled={{ before: startDate || new Date() }} />
          <DatePickerPopover placeholder="응답 마감일(선택)" selected={deadline} onSelect={setDeadline} disabled={{ before: new Date(), after: endDate }} />
        </DatePickersContainer>

        <SectionLabel>요일 설정</SectionLabel>
        <WeekdaySelector>
          {WEEKDAYS.map((day) => (
            <WeekdayLabel key={day.value} checked={selectedWeekdays.has(day.value)}>
              <input type="checkbox" checked={selectedWeekdays.has(day.value)} onChange={() => handleWeekdayChange(day.value)} />
              {day.label}
            </WeekdayLabel>
          ))}
        </WeekdaySelector>
      </Section>
      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? '생성 중...' : '약속 만들기'}
      </SubmitButton>
    </FormContainer>
  );
}
