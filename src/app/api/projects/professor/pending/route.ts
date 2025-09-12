import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const professorId = url.searchParams.get('professorId');

    if (!professorId) {
      return NextResponse.json(
        {error: 'Professor ID is required'},
        {status: 400}
      );
    }

    // Get projects assigned to this professor that are not graded yet
    const pendingProjects = await prisma.project.findMany({
      where: {
        publisherId: parseInt(professorId),
        isGraded: false,
      },
      include: {
        sender: {
          select: {
            Fname: true,
            Lname: true,
            Snumber: true,
            major: true,
          },
        },
      },
      orderBy: {
        sendDate: 'desc',
      },
    });

    // Transform data to match the expected format
    const formattedProjects = pendingProjects.map((project) => ({
      id: project.id.toString(),
      title: project.title,
      student: `${project.sender.Fname} ${project.sender.Lname}`,
      studentId: project.sender.Snumber,
      major: project.sender.major,
      submissionDate: new Date(project.sendDate).toLocaleDateString('fa-IR'),
      publishDate: new Date(project.publishedDate).toLocaleDateString('fa-IR'),
      description: project.description,
      projectAddress: project.projectAddress,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching pending projects:', error);
    return NextResponse.json(
      {error: 'Failed to fetch pending projects'},
      {status: 500}
    );
  }
}
