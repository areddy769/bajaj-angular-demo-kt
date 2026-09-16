import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/prisma';
import { hashPassword } from '../src/utils/password';

export const app = createApp();

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
}

// Makes the suite self-sufficient: guarantees the demo logins exist
// even if `npm run seed` was not executed before `npm test`.
export async function ensureTestData(): Promise<void> {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { status: 'ACTIVE', role: 'ADMIN', passwordHash: await hashPassword('Admin@123') },
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: await hashPassword('Admin@123'),
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: { status: 'ACTIVE', role: 'USER', passwordHash: await hashPassword('User@123') },
    create: {
      name: 'Demo User',
      email: 'user@example.com',
      passwordHash: await hashPassword('User@123'),
      role: 'USER',
      status: 'ACTIVE',
    },
  });

  const count = await prisma.customer.count();
  if (count === 0) {
    await prisma.customer.createMany({
      data: [
        { firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@example.com', mobile: '9876543210', gender: 'MALE', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
        { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com', mobile: '9876543211', gender: 'FEMALE', city: 'Pune', state: 'Maharashtra', pincode: '411001', customerType: 'INDIVIDUAL', status: 'INACTIVE' },
      ],
    });
  }
}

export async function loginAs(email: string, password: string): Promise<string> {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  if (res.status !== 200) throw new Error(`login failed for ${email}: ${res.status} ${JSON.stringify(res.body)}`);
  return res.body.data.token as string;
}

export async function closeDb(): Promise<void> {
  await prisma.$disconnect();
}
