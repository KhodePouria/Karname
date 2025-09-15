import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: {params: Promise<{classroomId: string}>}
) {
  try {
    const params = await context.params;
    const classroomId = parseInt(params.classroomId);

    const classroom = await prisma.classroom.findUnique({
      where: {id: classroomId},
    });
    if (!classroom) {
      return NextResponse.json(
        {success: false, error: 'Classroom not found'},
        {status: 404}
      );
    }

    const members = await prisma.classroomMember.findMany({
      where: {classroomId},
      include: {
        student: {
          select: {
            id: true,
            Fname: true,
            Lname: true,
            Snumber: true,
            major: true,
          },
        },
      },
      orderBy: {joinedAt: 'desc'},
    });

    const formatted = members.map((m) => ({
      id: m.student.id,
      name: `${m.student.Fname} ${m.student.Lname}`,
      studentNumber: m.student.Snumber,
      major: m.student.major,
      joinedAt: m.joinedAt,
    }));

    return NextResponse.json({success: true, members: formatted});
  } catch (error) {
    console.error('Error fetching classroom members:', error);
    return NextResponse.json(
      {success: false, error: 'Internal server error'},
      {status: 500}
    );
  }
}
