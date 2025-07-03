import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { isAfter, isBefore } from 'date-fns';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id)
    return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });


  try {
    const { title, startDate, endDate, availableDays, deadline } = await req.json();


    if (!title || !startDate || !endDate || !availableDays)
      return NextResponse.json({ message: '필수 정보가 누락되었습니다.' }, { status: 400 });

    if (isBefore(new Date(endDate), new Date(startDate)))
      return NextResponse.json({ message: '종료일은 시작일보다 빠를 수 없습니다.' }, { status: 400 });

    if (deadline && isAfter(new Date(deadline), new Date(endDate)))
      return NextResponse.json({ message: '마감일은 종료일보다 늦을 수 없습니다.' }, { status: 400 });


    const newCalendar = await prisma.calendar.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        availableDays,
        deadline: deadline ? new Date(deadline) : null, // deadline이 있을 경우에만 저장
        ownerId: session.user.id,
        participants: { create: { userId: session.user.id } },
      },
    });

    return NextResponse.json(newCalendar, { status: 201 });
  } catch (error) {
    console.error('캘린더 생성 오류:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
