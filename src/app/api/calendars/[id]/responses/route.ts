import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { Status } from '@prisma/client';
import { authOptions } from '@/utils/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id: calendarId } = await params;
  const userId = session.user.id;
  const { dates, status }: { dates: string[]; status: Status } = await req.json();

  if (!dates || !status) {
    return NextResponse.json({ message: 'Missing dates or status' }, { status: 400 });
  }

  try {
    // 트랜잭션을 사용하여 여러 개의 DB 작업을 원자적으로 처리
    await prisma.$transaction(
      dates.map((dateStr) => {
        const date = new Date(dateStr);
        return prisma.response.upsert({
          where: {
            calendarId_userId_date: { calendarId, userId, date },
          },
          update: { status },
          create: { calendarId, userId, date, status },
        });
      })
    );

    return NextResponse.json({ message: 'Responses saved successfully' }, { status: 200 });
  } catch (error) {
    console.error("Failed to save responses:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
