import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import path from 'path';
import {writeFile, mkdir} from 'fs/promises';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  context: {params: Promise<{assignmentId: string}>}
) {
  try {
    const params = await context.params;
    const assignmentId = params.assignmentId;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const studentId = formData.get('studentId') as string;

    if (!file || !studentId) {
      return NextResponse.json(
        {success: false, error: 'فایل و شناسه دانشجو الزامی هستند'},
        {status: 400}
      );
    }

    // Validate file type
    if (!file.name.endsWith('.zip') && file.type !== 'application/zip') {
      return NextResponse.json(
        {success: false, error: 'فقط فایل‌های ZIP مجاز هستند'},
        {status: 400}
      );
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {success: false, error: 'حجم فایل نباید بیشتر از 100 مگابایت باشد'},
        {status: 400}
      );
    }

    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: {id: parseInt(assignmentId)},
      include: {classroom: true},
    });

    if (!assignment) {
      return NextResponse.json(
        {success: false, error: 'تکلیف یافت نشد'},
        {status: 404}
      );
    }

    // Check if student is a member of the classroom
    const membership = await prisma.classroomMember.findFirst({
      where: {
        classroomId: assignment.classroomId,
        studentId: parseInt(studentId),
      },
    });

    if (!membership) {
      return NextResponse.json(
        {success: false, error: 'شما عضو این کلاس نیستید'},
        {status: 403}
      );
    }

    // Check if student has already submitted
    const existingSubmission = await prisma.project.findFirst({
      where: {
        assignmentId: parseInt(assignmentId),
        senderId: parseInt(studentId),
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        {success: false, error: 'شما قبلاً برای این تکلیف پاسخ ارسال کرده‌اید'},
        {status: 409}
      );
    }

    // Create uploads directory
    const uploadsDir = path.join(
      process.cwd(),
      'uploads',
      'assignments',
      assignmentId
    );
    try {
      await mkdir(uploadsDir, {recursive: true});
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `student_${studentId}_${timestamp}_${sanitizedName}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create project record
    const project = await prisma.project.create({
      data: {
        title: `پاسخ تکلیف: ${assignment.title}`,
        description: `پاسخ ارسال شده برای تکلیف ${assignment.title}`,
        senderId: parseInt(studentId),
        publisherId: assignment.classroom.professorId,
        assignmentId: parseInt(assignmentId),
        projectAddress: filepath,
        sendDate: new Date(),
        rating: null,
        feedback: null,
        isGraded: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'پاسخ شما با موفقیت ارسال شد',
      submission: {
        id: project.id,
        submissionDate: project.sendDate,
      },
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'خطای سرور در ارسال پاسخ',
      },
      {status: 500}
    );
  }
}
