import {NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';
import path from 'path';
import {writeFile} from 'fs/promises';
import {mkdir} from 'fs/promises';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    const studentId = formData.get('studentId') as string;

    if (!title || !description || !file || !studentId) {
      return NextResponse.json(
        {success: false, error: 'تمام فیلدها الزامی هستند'},
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

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {success: false, error: 'حجم فایل نباید بیشتر از 50 مگابایت باشد'},
        {status: 400}
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads', 'projects');
    try {
      await mkdir(uploadsDir, {recursive: true});
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${studentId}_${timestamp}_${originalName}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Find student in database
    const student = await prisma.student.findUnique({
      where: {id: parseInt(studentId)},
    });

    if (!student) {
      return NextResponse.json(
        {success: false, error: 'دانشجوی مورد نظر یافت نشد'},
        {status: 404}
      );
    }

    // For now, we'll create a project without a specific professor
    // You might want to modify this based on your needs
    // We can either assign to a random professor or wait for manual assignment

    // Get a professor to assign the project to (for now, get the first one)
    const professor = await prisma.professor.findFirst();

    if (!professor) {
      return NextResponse.json(
        {success: false, error: 'هیچ استادی در سیستم یافت نشد'},
        {status: 500}
      );
    }

    // Save project to database
    const project = await prisma.project.create({
      data: {
        title,
        description,
        senderId: parseInt(studentId),
        publisherId: professor.id,
        projectAddress: filepath,
        sendDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'پروژه با موفقیت آپلود شد',
      project: {
        id: project.id,
        title: project.title,
        uploadDate: project.sendDate,
      },
    });
  } catch (error) {
    console.error('Project upload error:', error);
    return NextResponse.json(
      {success: false, error: 'خطای سرور در آپلود پروژه'},
      {status: 500}
    );
  }
}
