import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const {projectId, rating, feedback} = await req.json();

    if (!projectId || rating === undefined) {
      return NextResponse.json(
        {error: 'Project ID and rating are required'},
        {status: 400}
      );
    }

    // Update the project with evaluation
    const updatedProject = await prisma.project.update({
      where: {
        id: parseInt(projectId),
      },
      data: {
        rating: parseFloat(rating),
        feedback: feedback || '',
        isGraded: true,
        gradedAt: new Date(),
      },
      include: {
        sender: {
          select: {
            Fname: true,
            Lname: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Evaluation submitted successfully',
      project: {
        id: updatedProject.id,
        title: updatedProject.title,
        student: `${updatedProject.sender.Fname} ${updatedProject.sender.Lname}`,
        rating: updatedProject.rating,
        feedback: updatedProject.feedback,
      },
    });
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    return NextResponse.json(
      {error: 'Failed to submit evaluation'},
      {status: 500}
    );
  }
}
