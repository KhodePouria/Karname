import {NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {email, password} = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {error: 'ایمیل و رمز عبور الزامی است'},
        {status: 400}
      );
    }

    // Try to find student
    const student = await prisma.student.findFirst({
      where: {
        OR: [{email}, {Snumber: email}],
      },
    });

    if (student && (await bcrypt.compare(password, student.password))) {
      return NextResponse.json({
        success: true,
        user: {
          id: student.id.toString(),
          name: `${student.Fname} ${student.Lname}`,
          email: student.email,
          role: 'student',
          studentNumber: student.Snumber,
          major: student.major,
          year: student.year,
        },
      });
    }

    // Try to find professor
    const professor = await prisma.professor.findFirst({
      where: {
        OR: [{email}, {Pnumber: email}],
      },
    });

    if (professor && (await bcrypt.compare(password, professor.password))) {
      return NextResponse.json({
        success: true,
        user: {
          id: professor.id.toString(),
          name: `${professor.Fname} ${professor.Lname}`,
          email: professor.email,
          role: 'professor',
          professorNumber: professor.Pnumber,
        },
      });
    }
    console.log('email:', professor, 'password:', password);
    return NextResponse.json(
      {error: 'ایمیل یا رمز عبور نادرست است'},
      {status: 401}
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({error: 'خطای سرور'}, {status: 500});
  }
}
