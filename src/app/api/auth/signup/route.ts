import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      studentId,
      email,
      password,
      department,
      year,
      role = 'student', // Default to student, can be overridden
    } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        {error: 'تمام فیلدهای الزامی را پر کنید'},
        {status: 400}
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    if (role === 'student') {
      if (!studentId || !department || !year) {
        return NextResponse.json(
          {error: 'شماره دانشجویی، رشته و سال تحصیلی الزامی است'},
          {status: 400}
        );
      }

      // Check if student already exists
      const existingStudent = await prisma.student.findFirst({
        where: {
          OR: [{email}, {Snumber: studentId}],
        },
      });

      if (existingStudent) {
        return NextResponse.json(
          {error: 'ایمیل یا شماره دانشجویی قبلاً ثبت شده است'},
          {status: 409}
        );
      }

      const student = await prisma.student.create({
        data: {
          Fname: firstName,
          Lname: lastName,
          Snumber: studentId,
          email,
          major: department,
          year: parseInt(year),
          password: hashedPassword,
        },
      });

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
    } else if (role === 'professor') {
      const professorNumber = studentId;

      if (!professorNumber) {
        return NextResponse.json(
          {error: 'شماره استاد الزامی است'},
          {status: 400}
        );
      }

      const existingProfessor = await prisma.professor.findFirst({
        where: {
          OR: [{email}, {Pnumber: professorNumber}],
        },
      });

      if (existingProfessor) {
        return NextResponse.json(
          {error: 'ایمیل یا شماره استاد قبلاً ثبت شده است'},
          {status: 409}
        );
      }

      const professor = await prisma.professor.create({
        data: {
          Fname: firstName,
          Lname: lastName,
          Pnumber: professorNumber,
          email,
          password: hashedPassword,
        },
      });

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

    return NextResponse.json({error: 'نوع کاربر نامعتبر است'}, {status: 400});
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({error: error}, {status: 500});
  }
}
