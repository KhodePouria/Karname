import {NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        {success: false, error: 'شناسه دانشجو الزامی است'},
        {status: 400}
      );
    }

    // Fetch student's projects
    const projects = await prisma.project.findMany({
      where: {
        senderId: parseInt(studentId),
      },
      include: {
        publisher: {
          select: {
            Fname: true,
            Lname: true,
          },
        },
      },
      orderBy: {
        sendDate: 'desc',
      },
    });

    // Format projects for frontend
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      uploadDate: project.sendDate.toLocaleDateString('fa-IR'),
      status: project.isGraded ? 'graded' : 'pending',
      rating: project.rating,
      feedback: project.feedback,
      professor: project.publisher
        ? `${project.publisher.Fname} ${project.publisher.Lname}`
        : 'نامشخص',
    }));

    return NextResponse.json({
      success: true,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {success: false, error: 'خطای سرور'},
      {status: 500}
    );
  }
}
