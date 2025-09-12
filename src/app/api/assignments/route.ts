import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const {title, description, classroomId, dueDate} = await req.json();

    if (!title || !description || !classroomId) {
      return NextResponse.json(
        {error: 'Title, description, and classroom ID are required'},
        {status: 400}
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        classroomId: parseInt(classroomId),
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        classroom: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      assignment: {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        classroomName: assignment.classroom.name,
        dueDate: assignment.dueDate,
        submissionCount: assignment._count.projects,
        createdAt: assignment.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      {error: 'Failed to create assignment'},
      {status: 500}
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const classroomId = url.searchParams.get('classroomId');

    if (!classroomId) {
      return NextResponse.json(
        {error: 'Classroom ID is required'},
        {status: 400}
      );
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        classroomId: parseInt(classroomId),
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedAssignments = assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      submissionCount: assignment._count.projects,
      createdAt: assignment.createdAt,
    }));

    return NextResponse.json({
      success: true,
      assignments: formattedAssignments,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      {error: 'Failed to fetch assignments'},
      {status: 500}
    );
  }
}
