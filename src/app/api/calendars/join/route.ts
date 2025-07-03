import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  try {
    const { inviteCode } = await req.json();
    if (!inviteCode) {
      return NextResponse.json({ message: '초대 코드를 입력해주세요.' }, { status: 400 });
    }

    // 초대 코드로 캘린더를 찾습니다.
    const calendarToJoin = await prisma.calendar.findUnique({
      where: { inviteCode },
    });

    if (!calendarToJoin) {
      return NextResponse.json({ message: '유효하지 않은 초대 코드입니다.' }, { status: 404 });
    }

    // 이미 참여한 사용자인지 확인합니다.
    const existingParticipant = await prisma.participant.findUnique({
      where: {
        userId_calendarId: {
          userId: session.user.id,
          calendarId: calendarToJoin.id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json({ message: '이미 참여한 캘린더입니다.' }, { status: 409 });
    }

    // 새로운 참여자로 추가합니다.
    await prisma.participant.create({
      data: {
        userId: session.user.id,
        calendarId: calendarToJoin.id,
      },
    });

    return NextResponse.json(calendarToJoin, { status: 200 });
  } catch (error) {
    console.error('캘린더 참여 오류:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
