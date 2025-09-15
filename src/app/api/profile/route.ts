import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      role,
      firstName,
      lastName,
      email,
      major,
      year,
      currentPassword,
      newPassword,
    } = body;

    if (!id || !role) {
      return NextResponse.json(
        {success: false, error: 'User id and role are required'},
        {status: 400}
      );
    }

    if (role === 'professor') {
      const updates: Record<string, unknown> = {};
      if (typeof firstName === 'string') updates.Fname = firstName.trim();
      if (typeof lastName === 'string') updates.Lname = lastName.trim();
      if (typeof email === 'string') updates.email = email.trim();

      if (newPassword) {
        const user = await prisma.professor.findUnique({
          where: {id: parseInt(id)},
          select: {password: true},
        });
        if (!user) {
          return NextResponse.json(
            {success: false, error: 'User not found'},
            {status: 404}
          );
        }
        if (
          !currentPassword ||
          !(await bcrypt.compare(currentPassword, user.password))
        ) {
          return NextResponse.json(
            {success: false, error: 'Current password is incorrect'},
            {status: 400}
          );
        }
        updates.password = await bcrypt.hash(newPassword, 12);
      }

      const updated = await prisma.professor.update({
        where: {id: parseInt(id)},
        data: updates,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: updated.id.toString(),
          name: `${updated.Fname} ${updated.Lname}`.trim(),
          email: updated.email,
          role: 'professor',
          professorNumber: updated.Pnumber,
        },
      });
    }

    if (role === 'student') {
      const updates: Record<string, unknown> = {};
      if (typeof firstName === 'string') updates.Fname = firstName.trim();
      if (typeof lastName === 'string') updates.Lname = lastName.trim();
      if (typeof email === 'string') updates.email = email.trim();
      if (typeof major === 'string') updates.major = major.trim();
      if (typeof year !== 'undefined' && year !== null)
        updates.year = parseInt(year);

      if (newPassword) {
        const user = await prisma.student.findUnique({
          where: {id: parseInt(id)},
          select: {password: true},
        });
        if (!user) {
          return NextResponse.json(
            {success: false, error: 'User not found'},
            {status: 404}
          );
        }
        if (
          !currentPassword ||
          !(await bcrypt.compare(currentPassword, user.password))
        ) {
          return NextResponse.json(
            {success: false, error: 'Current password is incorrect'},
            {status: 400}
          );
        }
        updates.password = await bcrypt.hash(newPassword, 12);
      }

      const updated = await prisma.student.update({
        where: {id: parseInt(id)},
        data: updates,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: updated.id.toString(),
          name: `${updated.Fname} ${updated.Lname}`.trim(),
          email: updated.email,
          role: 'student',
          studentNumber: updated.Snumber,
          major: updated.major,
          year: updated.year,
        },
      });
    }

    return NextResponse.json(
      {success: false, error: 'Unsupported role'},
      {status: 400}
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      {success: false, error: 'Internal server error'},
      {status: 500}
    );
  }
}
