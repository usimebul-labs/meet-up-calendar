import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getCalendarDetails } from '@/services/calendar.service';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';


export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });


  const { id } = await params;
  const userId = session.user.id;

  try {
    const calendarData = await getCalendarDetails(id, userId);
    if (!calendarData)
      return NextResponse.json({ message: 'Forbidden or Not Found' }, { status: 403 });

    return NextResponse.json(calendarData);
  } catch (error) {
    console.error("Failed to fetch calendar data:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  const calendarId = params.id;
  const userId = session.user.id;

  try {
    // 삭제 권한을 확인하기 위해 캘린더 정보를 가져옵니다.
    // 캘린더의 '소유자(owner)'만 삭제할 수 있도록 합니다.
    const calendarToDelete = await prisma.calendar.findUnique({
      where: {
        id: calendarId,
      },
      select: {
        ownerId: true, // 소유자 ID만 가져오면 됩니다.
      },
    });

    if (!calendarToDelete) {
      return NextResponse.json({ message: '캘린더를 찾을 수 없습니다.' }, { status: 404 });
    }

    if (calendarToDelete.ownerId !== userId) {
      return NextResponse.json({ message: '삭제 권한이 없습니다.' }, { status: 403 });
    }

    // Prisma의 onDelete: Cascade 설정 덕분에, 캘린더를 삭제하면
    // 관련된 Participant, Response 레코드도 자동으로 함께 삭제됩니다.
    await prisma.calendar.delete({
      where: {
        id: calendarId,
      },
    });

    return NextResponse.json({ message: '캘린더가 성공적으로 삭제되었습니다.' }, { status: 200 });

  } catch (error) {
    console.error("캘린더 삭제 오류:", error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
