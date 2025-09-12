import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  context: {params: Promise<{projectId: string}>}
) {
  try {
    const params = await context.params;
    const projectId = params.projectId;
    const body = await request.json();
    const {rating, feedback} = body;

    if (rating === undefined || rating < 0 || rating > 20) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rating must be between 0 and 20',
        },
        {status: 400}
      );
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: parseInt(projectId),
      },
      data: {
        rating: parseFloat(rating),
        feedback: feedback || null,
        isGraded: true,
        gradedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error rating project:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {status: 500}
    );
  }
}
