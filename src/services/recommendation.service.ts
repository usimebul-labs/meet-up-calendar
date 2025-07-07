import type { CalendarData } from './calendar.service';
import type { Response } from '@prisma/client';

interface RecommendedDate {
  date: string;
  attendees: number;
  score: number;
  attendeeIds: string[];
}



export function calculateRecommendations(
  responses: CalendarData['responses'],
  participants: CalendarData['participants'],
  requiredParticipantIds: Set<string> // --- 추가된 인자 ---

): RecommendedDate[] { // 반환 타입을 배열로 변경
  const totalParticipants = participants.length;
  if (totalParticipants === 0) return [];

  const participantIds = new Set(participants.map(p => p.userId));
  const statsByDate = new Map<string, { preferred: Set<string>; unavailable: Set<string> }>();

  for (const res of responses) {
    const dateKey = new Date(res.date).toISOString().split('T')[0];
    if (!statsByDate.has(dateKey)) {
      statsByDate.set(dateKey, { preferred: new Set(), unavailable: new Set() });
    }
    const stats = statsByDate.get(dateKey)!;

    if (res.status === 'PREFERRED') stats.preferred.add(res.userId);
    if (res.status === 'UNAVAILABLE') stats.unavailable.add(res.userId);
  }

  const allDateStats: RecommendedDate[] = [];
  for (const [date, stats] of statsByDate.entries()) {

    const hasRequiredParticipantUnavailable = Array.from(requiredParticipantIds)
      .some(requiredId => stats.unavailable.has(requiredId));

    // 만약 필수 참석자가 불참했다면, 이 날짜는 추천 목록에 포함하지 않습니다.
    if (hasRequiredParticipantUnavailable) continue;

    const attendeeIds = Array.from(participantIds).filter(id => !stats.unavailable.has(id));
    const attendees = attendeeIds.length;

    // --- 핵심 점수 계산 로직 변경 ---
    // 선호하는 사람은 2점, 그 외 참석자는 1점.
    // 선호하는 사람의 ID Set을 가져옵니다.
    const preferredUserIds = stats.preferred;
    // 전체 참석자 중에서 선호하는 사람을 제외하면 '일반 참석자'입니다.
    const normalAttendees = attendees - preferredUserIds.size;
    // 점수 = (선호자 수 * 2) + (일반 참석자 수 * 1)
    const score = (preferredUserIds.size * 2) + normalAttendees;


    // 참석자가 0명인 날짜는 추천 목록에서 의미가 없으므로 제외
    if (attendees > 0) {
      allDateStats.push({
        date,
        attendees,
        score,
        attendeeIds,
      });
    }
  }

  // --- 핵심 정렬 로직 변경 ---
  allDateStats.sort((a, b) => {
    // 1. 참석자 수 기준 내림차순 정렬
    if (b.attendees !== a.attendees) return b.attendees - a.attendees;
    // 2. 선호도 점수 기준 내림차순 정렬
    if (b.score !== a.score) return b.score - a.score;
    // 3. 날짜 기준 오름차순 정렬
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // 상위 5~10개 정도만 잘라서 반환
  return allDateStats.slice(0, 10);
}