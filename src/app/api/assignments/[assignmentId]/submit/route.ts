import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {createClient} from '@supabase/supabase-js';

const prisma = new PrismaClient();
// Use service role key for server-side operations to bypass RLS
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

console.log('Supabase URL configured:', !!supabaseUrl);
console.log('Service key configured:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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

    // Generate unique filename for storage
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `student_${studentId}_${timestamp}_${sanitizedName}`;
    const filePath = `assignments/${assignmentId}/${filename}`;

    // Upload to Supabase Storage
    // Convert the file to array buffer first
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      // First, check if the bucket exists, create it if it doesn't
      const { data: buckets } = await supabase
        .storage
        .listBuckets();
      
      console.log('Available buckets:', buckets?.map(b => b.name));
      
      const projectsBucketExists = buckets?.some(bucket => bucket.name === 'projects');
      
      if (!projectsBucketExists) {
        console.log('Projects bucket does not exist, creating it');
        const { error: bucketError } = await supabase
          .storage
          .createBucket('projects', { 
            public: true,
            fileSizeLimit: 100 * 1024 * 1024 // 100MB
          });
          
        if (bucketError) {
          console.error('Failed to create bucket:', bucketError);
          return NextResponse.json(
            {success: false, error: `خطا در ایجاد مخزن فایل: ${bucketError.message}`},
            {status: 500}
          );
        }
      }

      // Now try to upload with explicit RLS bypass
      console.log('Attempting upload to path:', filePath);
      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, buffer, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return NextResponse.json(
          {success: false, error: `خطا در آپلود فایل: ${uploadError.message}`},
          {status: 500}
        );
      }
      console.log('File uploaded successfully');
    } catch (uploadError) {
      console.error('Caught upload error:', uploadError);
      return NextResponse.json(
        {success: false, error: 'خطا در آپلود فایل به سرور'},
        {status: 500}
      );
    }

    // Get the public URL for the uploaded file
    const {data: publicUrlData} = supabase.storage
      .from('projects')
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return NextResponse.json(
        {success: false, error: 'خطا در ایجاد لینک دسترسی به فایل'},
        {status: 500}
      );
    }

    // Create project record
    const project = await prisma.project.create({
      data: {
        title: `پاسخ تکلیف: ${assignment.title}`,
        description: `پاسخ ارسال شده برای تکلیف ${assignment.title}`,
        senderId: parseInt(studentId),
        publisherId: assignment.classroom.professorId,
        assignmentId: parseInt(assignmentId),
        projectAddress: publicUrlData.publicUrl,
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
