import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
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

    // Get all classrooms the student is a member of
    const classroomMembers = await prisma.classroomMember.findMany({
      where: {
        studentId: parseInt(studentId),
      },
      select: {
        classroomId: true,
      },
    });

    const classroomIds = classroomMembers.map((member) => member.classroomId);

    if (classroomIds.length === 0) {
      return NextResponse.json({
        success: true,
        assignments: [],
      });
    }

    // Get all assignments from those classrooms
    const assignments = await prisma.assignment.findMany({
      where: {
        classroomId: {
          in: classroomIds,
        },
      },
      include: {
        classroom: {
          select: {
            id: true,
            name: true,
          },
        },
        projects: {
          where: {
            senderId: parseInt(studentId),
          },
          select: {
            id: true,
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedAssignments = assignments.map((assignment) => {
      const submission = assignment.projects[0]; // Student can only have one submission per assignment

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate?.toISOString() || null,
        createdAt: assignment.createdAt.toISOString(),
        classroom: {
          id: assignment.classroom.id,
          name: assignment.classroom.name,
        },
        hasSubmission: !!submission,
        submissionRating: submission?.rating || null,
      };
    });

    return NextResponse.json({
      success: true,
      assignments: formattedAssignments,
    });
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {status: 500}
    );
  }
}
