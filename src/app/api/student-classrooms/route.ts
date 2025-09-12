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

    const classroomMembers = await prisma.classroomMember.findMany({
      where: {
        studentId: parseInt(studentId),
      },
      include: {
        classroom: {
          include: {
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
      orderBy: {
        joinedAt: 'desc',
      },
    });

    const classrooms = classroomMembers.map((member) => ({
      id: member.classroom.id,
      name: member.classroom.name,
      description: member.classroom.description,
      professor: {
        name: `${member.classroom.professor.Fname} ${member.classroom.professor.Lname}`,
      },
      joinedAt: member.joinedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      classrooms,
    });
  } catch (error) {
    console.error('Error fetching student classrooms:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {status: 500}
    );
  }
}
