import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  {params}: {params: {assignmentId: string}}
) {
  try {
    const assignmentId = params.assignmentId;

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: parseInt(assignmentId),
      },
      include: {
        classroom: {
          select: {
            id: true,
            name: true,
            professorId: true,
            professor: {
              select: {
                id: true,
                Fname: true,
                Lname: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Assignment not found',
        },
        {status: 404}
      );
    }

    const formattedAssignment = {
      ...assignment,
      classroom: {
        ...assignment.classroom,
        professor: {
          id: assignment.classroom.professor.id,
          name: `${assignment.classroom.professor.Fname} ${assignment.classroom.professor.Lname}`,
        },
      },
    };

    return NextResponse.json({
      success: true,
      assignment: formattedAssignment,
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {status: 500}
    );
  }
}
