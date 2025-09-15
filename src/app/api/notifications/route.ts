import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        {success: false, error: 'Student ID is required'},
        {status: 400}
      );
    }

    const sid = parseInt(studentId);

    // Find all classrooms the student is a member of
    const classroomMembers = await prisma.classroomMember.findMany({
      where: {studentId: sid},
      select: {classroomId: true},
    });
    const classroomIds = classroomMembers.map((m) => m.classroomId);

    // Assignments created in student's classrooms
    let assignments: Array<{
      id: number;
      title: string;
      description: string;
      createdAt: Date;
      classroom: {id: number; name: string};
    }> = [];

    if (classroomIds.length > 0) {
      const a = await prisma.assignment.findMany({
        where: {classroomId: {in: classroomIds}},
        include: {
          classroom: {select: {id: true, name: true}},
        },
        orderBy: {createdAt: 'desc'},
        take: 100,
      });

      assignments = a.map((as) => ({
        id: as.id,
        title: as.title,
        description: as.description,
        createdAt: as.createdAt,
        classroom: {id: as.classroom.id, name: as.classroom.name},
      }));
    }

    // Graded projects for the student
    const gradedProjects = await prisma.project.findMany({
      where: {senderId: sid, isGraded: true},
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            classroom: {select: {id: true, name: true}},
          },
        },
        publisher: {select: {Fname: true, Lname: true}},
      },
      orderBy: [{gradedAt: 'desc'}, {publishedDate: 'desc'}],
      take: 100,
    });

    // Compose notifications
    type NotificationDTO = {
      id: string;
      title: string;
      message: string;
      date: string; // ISO
      read: boolean;
      type: 'assignment' | 'grade';
      projectId?: number | null;
      assignmentId?: number | null;
      classroomId?: number | null;
    };

    const assignmentNotifications: NotificationDTO[] = assignments.map(
      (as) => ({
        id: `assignment-${as.id}`,
        title: `تکلیف جدید: ${as.title}`,
        message: `در کلاس ${as.classroom.name}`,
        date: as.createdAt.toISOString(),
        read: false,
        type: 'assignment',
        assignmentId: as.id,
        classroomId: as.classroom.id,
      })
    );

    const gradeNotifications: NotificationDTO[] = gradedProjects.map((p) => ({
      id: `grade-${p.id}`,
      title: 'نمره ثبت شد',
      message: `${p.assignment?.title ? `برای "${p.assignment.title}"` : ''} ${
        typeof p.rating === 'number' ? `(نمره: ${p.rating.toFixed(1)}/20)` : ''
      } ${p.publisher ? `توسط ${p.publisher.Fname} ${p.publisher.Lname}` : ''}`.trim(),
      date: (p.gradedAt ?? p.publishedDate ?? p.sendDate).toISOString(),
      read: false,
      type: 'grade',
      projectId: p.id,
      assignmentId: p.assignmentId ?? null,
      classroomId: p.assignment?.classroom?.id ?? null,
    }));

    const notifications = [...assignmentNotifications, ...gradeNotifications]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 200);

    return NextResponse.json({success: true, notifications});
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      {success: false, error: 'Internal server error'},
      {status: 500}
    );
  }
}
