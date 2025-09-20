import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {createClient} from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Use service role key for server-side operations to bypass RLS
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

console.log('Supabase URL configured:', !!supabaseUrl);
console.log('Service key configured:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    const studentId = formData.get('studentId') as string;
    const assignmentId = formData.get('assignmentId') as string;

    if (!title || !description || !file || !studentId || !assignmentId) {
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

    // Upload file to Supabase Storage
    const filePath = `student-uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

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
            fileSizeLimit: 50 * 1024 * 1024 // 50MB
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
      const {error: uploadError} = await supabase.storage
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

    // Get public URL
    const {data: publicUrlData} = supabase.storage
      .from('projects')
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    // Save project in DB
    const project = await prisma.project.create({
      data: {
        title,
        description,
        senderId: parseInt(studentId),
        assignmentId: parseInt(assignmentId),
        projectAddress: publicUrl,
        publishedDate: new Date(),
        sendDate: new Date(),
        publisherId: 1, // You may want to set this properly
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
