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
import { useCalendarStore } from '@/store/calendarStore';

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

const DisclosureButton = styled(Disclosure.Button)<{ open: boolean; best: boolean }>`
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

  /* isBest prop에 따라 스타일 동적 변경 */
  border: 1px solid ${(props) => (props.best ? '#fbbf24' : 'transparent')};
  background-color: ${(props) => (props.best ? '#fefce8' : 'transparent')};

  ${(props) =>
    props.open &&
    css`
      background-color: #f3f4f6;
    `}
`;

// DateText를 flex container로 변경
const DateTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DateText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const BestChoiceIcon = styled.span`
  color: #f59e0b; /* Amber 500 */
  font-size: 0.85rem;
  line-height: 1;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  margin-left: 0.5rem;
`;

const InfoText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  background-color: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap; /* 줄바꿈 방지 */
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

const NoResultText = styled.p`
  font-size: 0.9rem;
  color: #9ca3af;
  text-align: center;
  padding: 1rem 0;
`;

type RecommendationPanelProps = {
  data: CalendarData;
};

export function RecommendationPanel({ data }: RecommendationPanelProps) {
  const { participants } = data;
    const requiredParticipantIds = useCalendarStore(state => state.requiredParticipantIds);


  const recommendedDates = useMemo(() => {
    return calculateRecommendations(data.responses, data.participants, requiredParticipantIds);
  }, [data.responses, data.participants, requiredParticipantIds]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'M월 d일 (E)', { locale: ko });
  };

  const getUserName = (userId: string) => {
    return participants.find((p) => p.userId === userId)?.user.name || 'Unknown';
  };

  return (
    <PanelContainer>
      {recommendedDates.length > 0 ? (
        <RecommendationList>
          {recommendedDates.map(({ date, attendees, score, attendeeIds }, index) => {
            // 목록의 첫 번째 항목인지 확인
            const isBestChoice = index === 0;

            return (
              <Disclosure as="div" key={date}>
                {({ open }) => (
                  <>
                    <DisclosureButton open={open} best={isBestChoice}>
                      <DateTextContainer>
                        {isBestChoice && <BestChoiceIcon>⭐</BestChoiceIcon>}
                        <DateText>{formatDate(date)}</DateText>
                      </DateTextContainer>
                      <InfoContainer>
                        <InfoText>
                          {attendees}명 ({score})
                        </InfoText>
                      </InfoContainer>
                    </DisclosureButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
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
            );
          })}
        </RecommendationList>
      ) : (
        <NoResultText>
          응답이 부족하여
          <br />
          추천할 수 없습니다.
        </NoResultText>
      )}
    </PanelContainer>
  );
}
