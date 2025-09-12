import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

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

    const professorIdInt = parseInt(professorId);

    // Get statistics
    const [pendingProjects, evaluatedProjects, activeStudents, todaysProjects] =
      await Promise.all([
        // Pending projects count
        prisma.project.count({
          where: {
            publisherId: professorIdInt,
            isGraded: false,
          },
        }),

        // Evaluated projects count
        prisma.project.count({
          where: {
            publisherId: professorIdInt,
            isGraded: true,
          },
        }),

        // Active students count (students who have submitted projects)
        prisma.project
          .groupBy({
            by: ['senderId'],
            where: {
              publisherId: professorIdInt,
            },
          })
          .then((result) => result.length),

        // Today's projects count
        prisma.project.count({
          where: {
            publisherId: professorIdInt,
            sendDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
      ]);

    const stats = {
      pendingEvaluations: pendingProjects,
      evaluatedProjects: evaluatedProjects,
      activeStudents: activeStudents,
      todaysProjects: todaysProjects,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching professor stats:', error);
    return NextResponse.json(
      {error: 'Failed to fetch statistics'},
      {status: 500}
    );
  }
}
