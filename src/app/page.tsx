import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import DashboardClient from '@/components/DashboardClient';
import { redirect } from 'next/navigation';

// Prisma의 타입을 클라이언트 컴포넌트에도 전달하기 위해 export 할 수 있습니다.
// Prisma.PromiseReturnType<T>를 사용하여 함수의 반환 타입을 추론합니다.
import { Prisma } from '@prisma/client';

// 캘린더 데이터를 가져오는 함수의 반환 타입을 정의합니다.
// 이 타입은 클라이언트 컴포넌트에서 props 타입으로 사용됩니다.
export type CalendarWithParticipant = Prisma.PromiseReturnType<typeof getCalendars>[0];

// 비동기 함수로 사용자의 캘린더 목록을 가져옵니다.
async function getCalendars(userId: string) {
  const calendars = await prisma.calendar.findMany({
    where: {
      // 'participants' 관계 배열에 현재 사용자가 포함된 모든 캘린더를 찾습니다.
      participants: {
        some: {
          userId: userId,
        },
      },
    },
    // 최신순으로 정렬
    orderBy: {
      createdAt: 'desc',
    },
    // 필요하다면 다른 정보도 함께 가져올 수 있습니다.
    // include: {
    //   owner: { select: { name: true } },
    // },
  });
  return calendars;
}


export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
  if (!session?.user?.id) {
    redirect('/login');
  }

  // DB에서 사용자가 참여 중인 캘린더 목록을 가져옵니다.
  const calendars = await getCalendars(session.user.id);

  // 가져온 데이터와 세션 정보를 클라이언트 컴포넌트에 props로 전달합니다.
  return (
    <DashboardClient initialCalendars={calendars} user={session.user} />
  );
}
