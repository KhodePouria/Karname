import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  {params}: {params: {assignmentId: string}}
) {
  try {
    const assignmentId = params.assignmentId;
    const {searchParams} = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student ID is required',
        },
        {status: 400}
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        assignmentId: parseInt(assignmentId),
        senderId: parseInt(studentId),
      },
    });

    if (!project) {
      return NextResponse.json({
        success: true,
        submission: null,
      });
    }

    const submission = {
      id: project.id,
      title: project.title,
      description: project.description,
      projectAddress: project.projectAddress,
      sendDate: project.sendDate.toISOString(),
      rating: project.rating,
      feedback: project.feedback,
      isGraded: project.isGraded,
    };

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error('Error fetching student submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {status: 500}
    );
  }
}
