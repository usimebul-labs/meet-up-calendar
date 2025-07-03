'use client';

import { Fragment, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { calculateRecommendations } from '@/services/recommendation.service';
import type { CalendarData } from '@/services/calendar.service';
import { Disclosure, Transition } from '@headlessui/react'; // Disclosure, Transition import
import { getUserColor } from '@/utils/colorUtils';

const PanelContainer = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

const SectionTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.75rem;
`;

const RecommendationList = styled.div`
  /* ul -> div로 변경 */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RecommendationItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f9fafb;
  }
`;

const NoResultText = styled.p`
  font-size: 0.9rem;
  color: #9ca3af;
  text-align: center;
  padding: 1rem 0;
`;

const DisclosureButton = styled(Disclosure.Button)<{ open: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  text-align: left;
  background-color: transparent;
  transition: all 0.2s;

  &:hover {
    background-color: #f9fafb;
    border-color: #e5e7eb;
  }

  ${(props) =>
    props.open &&
    css`
      background-color: #f3f4f6;
    `}
`;

const DateText = styled.span`
  font-weight: 500;
  color: #374151;
`;

const InfoText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  background-color: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
`;

const DisclosurePanel = styled(Disclosure.Panel)`
  padding: 0.75rem 1rem 1rem 1rem;
  background-color: #f9fafb;
  border-radius: 0 0 6px 6px;
  margin-top: -6px; /* 버튼과 패널 사이 간격 제거 */
`;

const ParticipantNameList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ParticipantTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: #ffffff;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-size: 0.8rem;
  color: #4b5563;
`;

const ColorDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

type RecommendationPanelProps = {
  data: CalendarData;
};

export function RecommendationPanel({ data }: RecommendationPanelProps) {
  const { participants } = data;
  const { maxAttendanceDates, bestPreferenceDates } = useMemo(() => {
    return calculateRecommendations(data.responses, data.participants);
  }, [data.responses, data.participants]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'M월 d일 (E)', { locale: ko });
  };

  const getUserName = (userId: string) => {
    return participants.find((p) => p.userId === userId)?.user.name || 'Unknown';
  };

  return (
    <PanelContainer>
      <div style={{ marginBottom: '1.5rem' }}>
        <SectionTitle>📅 최다 참석일</SectionTitle>
        {maxAttendanceDates.length > 0 ? (
          <RecommendationList>
            {maxAttendanceDates.map(({ date, attendees, attendeeIds }) => (
              <Disclosure as="div" key={date}>
                {({ open }) => (
                  <>
                    <DisclosureButton open={open}>
                      <DateText>{formatDate(date)}</DateText>
                      <InfoText>참석 {attendees}명</InfoText>
                    </DisclosureButton>
                    <Transition as={Fragment} /* ... 애니메이션 설정 ... */>
                      <DisclosurePanel>
                        <ParticipantNameList>
                          {attendeeIds.map((id) => (
                            <ParticipantTag key={id}>
                              <ColorDot color={getUserColor(id)} />
                              {getUserName(id)}
                            </ParticipantTag>
                          ))}
                        </ParticipantNameList>
                      </DisclosurePanel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </RecommendationList>
        ) : (
          <NoResultText>
            응답이 부족하여
            <br />
            추천할 수 없습니다.
          </NoResultText>
        )}
      </div>

      <div>
        <SectionTitle>⭐ 날짜 선호도</SectionTitle>
        {bestPreferenceDates.length > 0 ? (
          <RecommendationList>
            {bestPreferenceDates.map(({ date, score, attendeeIds }) => (
              <Disclosure as="div" key={date}>
                {({ open }) => (
                  <>
                    <DisclosureButton open={open}>
                      <DateText>{formatDate(date)}</DateText>
                      <InfoText>선호도 {score}점</InfoText>
                    </DisclosureButton>
                    <Transition as={Fragment} /* ... 애니메이션 설정 ... */>
                      <DisclosurePanel>
                        <ParticipantNameList>
                          {attendeeIds.map((id) => (
                            <ParticipantTag key={id}>
                              <ColorDot color={getUserColor(id)} />
                              {getUserName(id)}
                            </ParticipantTag>
                          ))}
                        </ParticipantNameList>
                      </DisclosurePanel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </RecommendationList>
        ) : (
          <NoResultText>
            모두가 가능한 날이 없거나,
            <br />
            응답이 부족합니다.
          </NoResultText>
        )}
      </div>
    </PanelContainer>
  );
}
