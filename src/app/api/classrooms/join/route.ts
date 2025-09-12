import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const {joinCode, studentId} = await req.json();

    if (!joinCode || !studentId) {
      return NextResponse.json(
        {error: 'Join code and student ID are required'},
        {status: 400}
      );
    }

    // Find classroom by join code
    const classroom = await prisma.classroom.findUnique({
      where: {joinCode: joinCode.toUpperCase()},
      include: {
        professor: {
          select: {
            Fname: true,
            Lname: true,
          },
        },
      },
    });

    if (!classroom) {
      return NextResponse.json({error: 'Invalid join code'}, {status: 404});
    }

    // Check if student is already a member
    const existingMember = await prisma.classroomMember.findUnique({
      where: {
        studentId_classroomId: {
          studentId: parseInt(studentId),
          classroomId: classroom.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        {error: 'You are already a member of this classroom'},
        {status: 400}
      );
    }

    // Add student to classroom
    await prisma.classroomMember.create({
      data: {
        studentId: parseInt(studentId),
        classroomId: classroom.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully joined ${classroom.name}`,
      classroom: {
        id: classroom.id,
        name: classroom.name,
        description: classroom.description,
        professor: `${classroom.professor.Fname} ${classroom.professor.Lname}`,
      },
    });
  } catch (error) {
    console.error('Error joining classroom:', error);
    return NextResponse.json(
      {error: 'Failed to join classroom'},
      {status: 500}
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        {error: 'Student ID is required'},
        {status: 400}
      );
    }

    const memberships = await prisma.classroomMember.findMany({
      where: {
        studentId: parseInt(studentId),
      },
      include: {
        classroom: {
          include: {
            professor: {
              select: {
                Fname: true,
                Lname: true,
              },
            },
            _count: {
              select: {
                members: true,
                assignments: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    const classrooms = memberships.map((membership) => ({
      id: membership.classroom.id,
      name: membership.classroom.name,
      description: membership.classroom.description,
      professor: `${membership.classroom.professor.Fname} ${membership.classroom.professor.Lname}`,
      memberCount: membership.classroom._count.members,
      assignmentCount: membership.classroom._count.assignments,
      joinedAt: membership.joinedAt,
    }));

    return NextResponse.json({
      success: true,
      classrooms,
    });
  } catch (error) {
    console.error('Error fetching student classrooms:', error);
    return NextResponse.json(
      {error: 'Failed to fetch classrooms'},
      {status: 500}
    );
  }
}
