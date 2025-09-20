import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {readFile} from 'fs/promises';
import {createClient} from '@supabase/supabase-js';

const prisma = new PrismaClient();
// Use service role key for server-side operations to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

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
    const fileUrl = project.projectAddress;
    if (!fileUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'فایل پروژه یافت نشد',
        },
        {status: 404}
      );
    }

    // Handle Supabase URLs - redirect to the URL directly
    if (fileUrl.startsWith('http')) {
      return NextResponse.redirect(fileUrl);
    }

    try {
      // For local files (legacy), try to read the file
      const fileBuffer = await readFile(fileUrl);

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
