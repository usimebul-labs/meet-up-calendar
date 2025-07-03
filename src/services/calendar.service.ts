import prisma from "@/lib/prisma";
import type { Prisma } from '@prisma/client';

/**
 * 특정 캘린더의 상세 정보를 가져오는 공통 함수
 * @param calendarId - 조회할 캘린더의 ID
 * @param userId - 현재 요청을 보낸 사용자의 ID (권한 확인용)
 * @returns 캘린더 데이터 또는 null
 */
export async function getCalendarDetails(calendarId: string, userId: string) {
  const calendar = await prisma.calendar.findUnique({
    where: { id: calendarId },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      responses: true,
    },
  });

  if (!calendar || !calendar.participants.some(p => p.userId === userId)) return null;


  return calendar;
}

type GetCalendarDetailsReturn = Prisma.PromiseReturnType<typeof getCalendarDetails>;



export type CalendarData = NonNullable<GetCalendarDetailsReturn>;