import type { CalendarData } from './calendar.service';
import type { Response } from '@prisma/client';

interface DateStats {
  date: string; // 'yyyy-MM-dd' 형식
  attendees: number;
  score: number;
  unavailableCount: number;
  attendeeIds: string[];
  unavailableIds: string[];
}


// "참석 가능" 인원은 명시적으로 'AVAILABLE' 또는 'PREFERRED'로 응답했거나,
// 아무 응답도 하지 않은 사람을 모두 포함합니다.
// 즉, 'UNAVAILABLE'만 아니면 참석 가능으로 간주합니다.

export function calculateRecommendations(
  responses: CalendarData['responses'],
  participants: CalendarData['participants']
) {
  const totalParticipants = participants.length;
  if (totalParticipants === 0) {
    return { maxAttendanceDates: [], bestPreferenceDates: [] };
  }

  const participantIds = new Set(participants.map(p => p.userId));
  const statsByDate = new Map<string, { preferred: Set<string>; unavailable: Set<string> }>();

  // 1. 날짜별로 '선호', '불가능' 응답 수 집계
  for (const res of responses) {
    const dateKey = new Date(res.date).toISOString().split('T')[0];
    if (!statsByDate.has(dateKey)) {
      statsByDate.set(dateKey, { preferred: new Set(), unavailable: new Set() });
    }
    const stats = statsByDate.get(dateKey)!;

    if (res.status === 'PREFERRED') stats.preferred.add(res.userId);
    if (res.status === 'UNAVAILABLE') stats.unavailable.add(res.userId);
  }

  // 2. 집계된 데이터를 기반으로 최종 통계 계산
  const allDateStats: DateStats[] = [];
    for (const [date, stats] of statsByDate.entries()) {
    // 불참자 ID 목록
    const unavailableIds = Array.from(stats.unavailable);
    
    // 참석자 ID 목록 (전체 참여자 - 불참자)
    const attendeeIds = Array.from(participantIds).filter(id => !stats.unavailable.has(id));
    
    const attendees = attendeeIds.length;
    // 선호도 점수 계산 (선호하는 사람 수 * 1 + 기본 참석 점수)
    const score = stats.preferred.size + attendees;

    allDateStats.push({
      date,
      attendees,
      score,
      unavailableCount: unavailableIds.length,
      attendeeIds,
      unavailableIds,
    });
  }


  // 3. 최다 참석일 계산
  const maxAttendees = Math.max(0, ...allDateStats.map(s => s.attendees));
  const maxAttendanceDates = allDateStats
    .filter(s => s.attendees === maxAttendees && maxAttendees > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // 날짜순 정렬
    .slice(0, 5); // 상위 5개만 표시

  // 4. 선호도 추천 날짜 계산
  const bestPreferenceDates = allDateStats
    // 한 명이라도 '불가능'한 날짜는 제외
    .filter(s => s.unavailableCount === 0)
    // 점수 > 참석자 수 > 날짜 순으로 정렬
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.attendees !== a.attendees) return b.attendees - a.attendees;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
    .slice(0, 5); // 상위 5개만 표시

  return { maxAttendanceDates, bestPreferenceDates };
}
