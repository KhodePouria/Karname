import {NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all students with their graded projects
    const students = await prisma.student.findMany({
      include: {
        projects: {
          where: {
            isGraded: true,
            rating: {
              not: null,
            },
          },
        },
      },
    });

    // Calculate average ratings and create leaderboard
    const leaderboardData = students
      .map((student) => {
        const gradedProjects = student.projects.filter(
          (p) => p.rating !== null
        );
        const totalRating = gradedProjects.reduce(
          (sum, project) => sum + (project.rating || 0),
          0
        );
        const averageRating =
          gradedProjects.length > 0 ? totalRating / gradedProjects.length : 0;

        return {
          id: student.id.toString(),
          name: `${student.Fname} ${student.Lname}`,
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          projectsCount: gradedProjects.length,
          totalProjects: student.projects.length,
        };
      })
      .filter((student) => student.projectsCount > 0) // Only include students with graded projects
      .sort((a, b) => b.rating - a.rating) // Sort by rating descending
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }));

    return NextResponse.json({
      success: true,
      leaderboard: leaderboardData,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      {success: false, error: 'خطای سرور'},
      {status: 500}
    );
  }
}
