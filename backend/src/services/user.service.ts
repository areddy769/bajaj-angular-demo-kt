import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { hashPassword } from '../utils/password';
import { AppError } from '../utils/api-response';

// Safe select — passwordHash is NEVER returned.
const safeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface UserListParams {
  page: number;
  limit: number;
  search?: string;
  role?: 'ADMIN' | 'USER';
  status?: 'ACTIVE' | 'INACTIVE';
}

export async function listUsers(params: UserListParams) {
  const { page, limit, search, role, status } = params;
  const where: Prisma.UserWhereInput = {};
  if (role) where.role = role;
  if (status) where.status = status;
  if (search) {
    where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
  }

  const totalItems = await prisma.user.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const items = await prisma.user.findMany({
    where,
    select: safeSelect,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return { items, pagination: { page, limit, totalItems, totalPages } };
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({ where: { id }, select: safeSelect });
  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function createUser(input: { name: string; email: string; password: string; role: 'ADMIN' | 'USER'; status: 'ACTIVE' | 'INACTIVE' }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError('Email already exists', 409);

  const passwordHash = await hashPassword(input.password);
  return prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash, role: input.role, status: input.status },
    select: safeSelect,
  });
}

export async function updateUser(
  id: number,
  input: { name?: string; email?: string; password?: string; role?: 'ADMIN' | 'USER'; status?: 'ACTIVE' | 'INACTIVE' },
) {
  await getUserById(id);

  if (input.email) {
    const clash = await prisma.user.findUnique({ where: { email: input.email } });
    if (clash && clash.id !== id) throw new AppError('Email already exists', 409);
  }

  const data: Prisma.UserUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.email !== undefined) data.email = input.email;
  if (input.role !== undefined) data.role = input.role;
  if (input.status !== undefined) data.status = input.status;
  // Only overwrite the hash when a new password is explicitly provided.
  if (input.password !== undefined && input.password !== '') {
    data.passwordHash = await hashPassword(input.password);
  }

  return prisma.user.update({ where: { id }, data, select: safeSelect });
}

export async function updateUserStatus(id: number, status: 'ACTIVE' | 'INACTIVE') {
  await getUserById(id);
  return prisma.user.update({ where: { id }, data: { status }, select: safeSelect });
}
