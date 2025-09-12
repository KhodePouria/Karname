import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  {params}: {params: {assignmentId: string}}
) {
  try {
    const assignmentId = params.assignmentId;

    const projects = await prisma.project.findMany({
      where: {
        assignmentId: parseInt(assignmentId),
      },
      include: {
        sender: {
          select: {
            id: true,
            Fname: true,
            Lname: true,
          },
        },
      },
      orderBy: {
        sendDate: 'desc',
      },
    });

    const submissions = projects.map((project) => ({
      id: project.id,
      studentName: `${project.sender.Fname} ${project.sender.Lname}`,
      studentId: project.sender.id,
      submissionDate: project.sendDate.toISOString(),
      rating: project.rating,
      feedback: project.feedback,
      projectUrl: project.projectAddress,
    }));

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {status: 500}
    );
  }
}
