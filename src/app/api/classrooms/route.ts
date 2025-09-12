import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// Generate a random 6-character join code
function generateJoinCode(): string {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // Excluding confusing chars like O, 0, I, l
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const {name, description, professorId} = await req.json();

    if (!name || !professorId) {
      return NextResponse.json(
        {error: 'Classroom name and professor ID are required'},
        {status: 400}
      );
    }

    // Generate unique join code
    let joinCode = generateJoinCode();
    let existing = await prisma.classroom.findUnique({where: {joinCode}});

    // Ensure join code is unique
    while (existing) {
      joinCode = generateJoinCode();
      existing = await prisma.classroom.findUnique({where: {joinCode}});
    }

    const classroom = await prisma.classroom.create({
      data: {
        name,
        description: description || '',
        joinCode,
        professorId: parseInt(professorId),
      },
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
    });

    return NextResponse.json({
      success: true,
      classroom: {
        id: classroom.id,
        name: classroom.name,
        description: classroom.description,
        joinCode: classroom.joinCode,
        professor: `${classroom.professor.Fname} ${classroom.professor.Lname}`,
        memberCount: classroom._count.members,
        assignmentCount: classroom._count.assignments,
        createdAt: classroom.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating classroom:', error);
    return NextResponse.json(
      {error: 'Failed to create classroom'},
      {status: 500}
    );
  }
}

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

    const classrooms = await prisma.classroom.findMany({
      where: {
        professorId: parseInt(professorId),
      },
      include: {
        _count: {
          select: {
            members: true,
            assignments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedClassrooms = classrooms.map((classroom) => ({
      id: classroom.id,
      name: classroom.name,
      description: classroom.description,
      joinCode: classroom.joinCode,
      memberCount: classroom._count.members,
      assignmentCount: classroom._count.assignments,
      createdAt: classroom.createdAt,
    }));

    return NextResponse.json({
      success: true,
      classrooms: formattedClassrooms,
    });
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    return NextResponse.json(
      {error: 'Failed to fetch classrooms'},
      {status: 500}
    );
  }
}
