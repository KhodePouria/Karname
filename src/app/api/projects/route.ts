import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      projectAddress,
      assignmentId,
      senderId,
      publisherId,
    } = body;

    if (
      !title ||
      !description ||
      !projectAddress ||
      !senderId ||
      !publisherId
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        {status: 400}
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        projectAddress,
        assignmentId: assignmentId ? parseInt(assignmentId) : null,
        senderId: parseInt(senderId),
        publisherId: parseInt(publisherId),
        sendDate: new Date(),
        publishedDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {status: 500}
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const professorId = searchParams.get('professorId');
    const studentId = searchParams.get('studentId');

    let projects;

    if (professorId) {
      projects = await prisma.project.findMany({
        where: {
          publisherId: parseInt(professorId),
        },
        include: {
          sender: {
            select: {
              id: true,
              Fname: true,
              Lname: true,
              Snumber: true,
            },
          },
          assignment: {
            select: {
              id: true,
              title: true,
              classroom: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          sendDate: 'desc',
        },
      });
    } else if (studentId) {
      projects = await prisma.project.findMany({
        where: {
          senderId: parseInt(studentId),
        },
        include: {
          publisher: {
            select: {
              id: true,
              Fname: true,
              Lname: true,
            },
          },
          assignment: {
            select: {
              id: true,
              title: true,
              classroom: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          sendDate: 'desc',
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Either professorId or studentId is required',
        },
        {status: 400}
      );
    }

    const formattedProjects = projects.map((project) => {
      const formattedProject: any = {...project};

      if ('sender' in project && project.sender) {
        formattedProject.sender = {
          id: project.sender.id,
          name: `${project.sender.Fname} ${project.sender.Lname}`,
          studentNumber: project.sender.Snumber,
        };
      }

      if ('publisher' in project && project.publisher) {
        formattedProject.publisher = {
          id: project.publisher.id,
          name: `${project.publisher.Fname} ${project.publisher.Lname}`,
        };
      }

      return formattedProject;
    });

    return NextResponse.json({
      success: true,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {status: 500}
    );
  }
}
