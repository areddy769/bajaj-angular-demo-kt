import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

// Idempotent: upsert demo users, skip customers that already exist.
async function main(): Promise<void> {
  const adminHash = await hashPassword('Admin@123');
  const userHash = await hashPassword('User@123');

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { name: 'Admin User', passwordHash: adminHash, role: 'ADMIN', status: 'ACTIVE' },
    create: { name: 'Admin User', email: 'admin@example.com', passwordHash: adminHash, role: 'ADMIN', status: 'ACTIVE' },
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: { name: 'Demo User', passwordHash: userHash, role: 'USER', status: 'ACTIVE' },
    create: { name: 'Demo User', email: 'user@example.com', passwordHash: userHash, role: 'USER', status: 'ACTIVE' },
  });

  // Realistic but fake Indian demo customers.
  const customers = [
    { firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@example.com', mobile: '9876543210', gender: 'MALE', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
    { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@example.com', mobile: '9876543211', gender: 'FEMALE', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
    { firstName: 'Amit', lastName: 'Verma', email: 'amit.verma@example.com', mobile: '9876543212', gender: 'MALE', city: 'Delhi', state: 'Delhi', pincode: '110001', customerType: 'BUSINESS', status: 'ACTIVE' },
    { firstName: 'Sneha', lastName: 'Iyer', email: 'sneha.iyer@example.com', mobile: '9876543213', gender: 'FEMALE', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
    { firstName: 'Vikram', lastName: 'Reddy', email: 'vikram.reddy@example.com', mobile: '9876543214', gender: 'MALE', city: 'Hyderabad', state: 'Telangana', pincode: '500001', customerType: 'BUSINESS', status: 'ACTIVE' },
    { firstName: 'Ananya', lastName: 'Gupta', email: 'ananya.gupta@example.com', mobile: '9876543215', gender: 'FEMALE', city: 'Pune', state: 'Maharashtra', pincode: '411001', customerType: 'INDIVIDUAL', status: 'INACTIVE' },
    { firstName: 'Rohan', lastName: 'Mehta', email: 'rohan.mehta@example.com', mobile: '9876543216', gender: 'MALE', city: 'Mumbai', state: 'Maharashtra', pincode: '400002', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
    { firstName: 'Kavya', lastName: 'Nair', email: 'kavya.nair@example.com', mobile: '9876543217', gender: 'FEMALE', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
    { firstName: 'Arjun', lastName: 'Singh', email: 'arjun.singh@example.com', mobile: '9876543218', gender: 'MALE', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', customerType: 'BUSINESS', status: 'INACTIVE' },
    { firstName: 'Divya', lastName: 'Kulkarni', email: 'divya.kulkarni@example.com', mobile: '9876543219', gender: 'FEMALE', city: 'Pune', state: 'Maharashtra', pincode: '411002', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
    { firstName: 'Kiran', lastName: 'Joshi', email: 'kiran.joshi@example.com', mobile: '9876543220', gender: 'MALE', city: 'Nagpur', state: 'Maharashtra', pincode: '440001', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
    { firstName: 'Meera', lastName: 'Das', email: 'meera.das@example.com', mobile: '9876543221', gender: 'FEMALE', city: 'Kolkata', state: 'West Bengal', pincode: '700001', customerType: 'BUSINESS', status: 'ACTIVE' },
    { firstName: 'Suresh', lastName: 'Menon', email: 'suresh.menon@example.com', mobile: '9876543222', gender: 'MALE', city: 'Kochi', state: 'Kerala', pincode: '682001', customerType: 'INDIVIDUAL', status: 'INACTIVE' },
    { firstName: 'Pooja', lastName: 'Agarwal', email: 'pooja.agarwal@example.com', mobile: '9876543223', gender: 'FEMALE', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
    { firstName: 'Nikhil', lastName: 'Bose', email: 'nikhil.bose@example.com', mobile: '9876543224', gender: 'MALE', city: 'Delhi', state: 'Delhi', pincode: '110002', customerType: 'BUSINESS', status: 'ACTIVE' },
    { firstName: 'Ritu', lastName: 'Yadav', email: 'ritu.yadav@example.com', mobile: '9876543225', gender: 'FEMALE', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001', customerType: 'INDIVIDUAL', status: 'ACTIVE' },
    { firstName: 'Farhan', lastName: 'Khan', email: 'farhan.khan@example.com', mobile: '9876543226', gender: 'MALE', city: 'Mumbai', state: 'Maharashtra', pincode: '400003', customerType: 'INDIVIDUAL', status: 'INACTIVE' },
    { firstName: 'Lakshmi', lastName: 'Rao', email: 'lakshmi.rao@example.com', mobile: '9876543227', gender: 'FEMALE', city: 'Hyderabad', state: 'Telangana', pincode: '500002', customerType: 'BUSINESS', status: 'ACTIVE' },
  ] as const;

  for (const c of customers) {
    const dob = new Date(1990 + (c.email.length % 15), c.email.length % 12, (c.email.length % 27) + 1);
    await prisma.customer.upsert({
      where: { email: c.email },
      update: {},
      create: { ...c, dateOfBirth: dob },
    });
  }

  // eslint-disable-next-line no-console
  console.log('Seed completed: 2 users + demo customers');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
