import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {readFile} from 'fs/promises';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: {params: Promise<{projectId: string}>}
) {
  try {
    const params = await context.params;
    const projectId = params.projectId;

    // Find the project
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(projectId),
      },
      include: {
        sender: true,
        publisher: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'پروژه یافت نشد',
        },
        {status: 404}
      );
    }

    // Check if file exists
    const filePath = project.projectAddress;
    if (!filePath) {
      return NextResponse.json(
        {
          success: false,
          error: 'فایل پروژه یافت نشد',
        },
        {status: 404}
      );
    }

    try {
      // Read the file
      const fileBuffer = await readFile(filePath);

      // Create a more user-friendly filename
      const studentName = `${project.sender.Fname}_${project.sender.Lname}`;
      const cleanProjectTitle = project.title.replace(
        /[^a-zA-Z0-9\u0600-\u06FF]/g,
        '_'
      );
      const downloadFilename = `${studentName}_${cleanProjectTitle}.zip`;

      // Create response with file
      const response = new NextResponse(fileBuffer);

      // Set headers for file download
      response.headers.set('Content-Type', 'application/zip');
      response.headers.set(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(downloadFilename)}"`
      );
      response.headers.set('Content-Length', fileBuffer.length.toString());

      return response;
    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json(
        {
          success: false,
          error: 'خطا در خواندن فایل پروژه',
        },
        {status: 500}
      );
    }
  } catch (error) {
    console.error('Error downloading project:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'خطای سرور در دانلود پروژه',
      },
      {status: 500}
    );
  }
}
