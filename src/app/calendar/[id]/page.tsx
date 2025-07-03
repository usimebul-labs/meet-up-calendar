import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCalendarDetails } from '@/services/calendar.service';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import CalendarClient from './CalendarClient';

interface Props {
  params: {
    id: string;
  };
}

export default async function CalendarPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/calendar/${params.id}`);
  }

  const { id } = await params;
  const calendarData = await getCalendarDetails(id, session.user.id);

  if (!calendarData) {
    notFound();
  }

  return <CalendarClient initialData={calendarData} />;
}
