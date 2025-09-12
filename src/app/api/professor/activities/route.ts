import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const professorId = url.searchParams.get('professorId');
    const limit = url.searchParams.get('limit') || '10';

    if (!professorId) {
      return NextResponse.json(
        {error: 'Professor ID is required'},
        {status: 400}
      );
    }

    // Get recent project submissions for this professor
    const recentSubmissions = await prisma.project.findMany({
      where: {
        publisherId: parseInt(professorId),
      },
      include: {
        sender: {
          select: {
            Fname: true,
            Lname: true,
          },
        },
      },
      orderBy: {
        sendDate: 'desc',
      },
      take: parseInt(limit),
    });

    // Transform submissions to activities format
    const activities = recentSubmissions.map((project) => ({
      id: project.id.toString(),
      type: project.isGraded ? 'evaluation' : 'submission',
      message: project.isGraded
        ? `شما پروژه «${project.title}» از ${project.sender.Fname} ${project.sender.Lname} را با امتیاز ${project.rating} ارزیابی کردید.`
        : `${project.sender.Fname} ${project.sender.Lname} پروژه جدیدی با عنوان «${project.title}» ارسال کرده است.`,
      date: new Date(
        project.isGraded && project.gradedAt
          ? project.gradedAt
          : project.sendDate
      ).toLocaleDateString('fa-IR'),
      time: new Date(
        project.isGraded && project.gradedAt
          ? project.gradedAt
          : project.sendDate
      ).toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      projectId: project.id.toString(),
    }));

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return NextResponse.json(
      {error: 'Failed to fetch recent activities'},
      {status: 500}
    );
  }
}
