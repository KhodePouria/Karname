import {PrismaClient} from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10);

  // Clear existing data first
  console.log('Clearing existing data...');
  await prisma.project.deleteMany();
  await prisma.student.deleteMany();
  await prisma.professor.deleteMany();

  // Create professor
  await prisma.professor.create({
    data: {
      email: 'pooriaramezani1382@gmail.com',
      Pnumber: '12345',
      Fname: 'Pouria',
      Lname: 'Ramezani',
      password: hashedPassword,
    },
  });
  console.log('Professor created with hashed password!');

  // Create test student
  await prisma.student.create({
    data: {
      email: 'student@test.com',
      Snumber: '4001531014',
      Fname: 'Test',
      Lname: 'Student',
      major: 'Computer Science',
      year: 3,
      password: hashedPassword,
    },
  });
  console.log('Student created with hashed password!');

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
