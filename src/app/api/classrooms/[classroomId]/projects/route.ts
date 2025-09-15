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

    const projects = await prisma.project.findMany({
      where: {assignment: {classroomId}},
      include: {
        sender: {select: {Fname: true, Lname: true, id: true}},
        assignment: {select: {id: true, title: true}},
      },
      orderBy: {sendDate: 'desc'},
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      sendDate: p.sendDate,
      rating: p.rating,
      isGraded: p.isGraded,
      student: {id: p.sender.id, name: `${p.sender.Fname} ${p.sender.Lname}`},
      assignment: p.assignment
        ? {id: p.assignment.id, title: p.assignment.title}
        : null,
    }));

    return NextResponse.json({success: true, projects: formatted});
  } catch (error) {
    console.error('Error fetching classroom projects:', error);
    return NextResponse.json(
      {success: false, error: 'Internal server error'},
      {status: 500}
    );
  }
}
