import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/api-response';
import { CustomerInput } from '../validators/customer.validator';

export interface CustomerListParams {
  page: number;
  limit: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  city?: string;
  customerType?: 'INDIVIDUAL' | 'BUSINESS';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Whitelist — prevents unsafe field names reaching Prisma `orderBy`.
const ALLOWED_SORT_FIELDS = new Set(['firstName', 'lastName', 'createdAt', 'status']);

function toDateOrUndefined(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

export async function listCustomers(params: CustomerListParams) {
  const { page, limit, search, status, city, customerType, sortBy, sortOrder } = params;

  const sortField = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';

  const where: Prisma.CustomerWhereInput = {};
  if (status) where.status = status;
  if (city) where.city = { contains: city };
  if (customerType) where.customerType = customerType;
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
      { mobile: { contains: search } },
    ];
  }

  const totalItems = await prisma.customer.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const items = await prisma.customer.findMany({
    where,
    orderBy: { [sortField]: sortOrder },
    skip: (page - 1) * limit,
    take: limit,
  });

  return { items, pagination: { page, limit, totalItems, totalPages } };
}

export async function getCustomerById(id: number) {
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) throw new AppError('Customer not found', 404);
  return customer;
}

export async function createCustomer(input: CustomerInput) {
  const existing = await prisma.customer.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError('Customer email already exists', 409);

  const { dateOfBirth, ...rest } = input;
  return prisma.customer.create({
    data: { ...rest, dateOfBirth: toDateOrUndefined(dateOfBirth) },
  });
}

export async function updateCustomer(id: number, input: Partial<CustomerInput>) {
  await getCustomerById(id);

  if (input.email) {
    const clash = await prisma.customer.findUnique({ where: { email: input.email } });
    if (clash && clash.id !== id) throw new AppError('Customer email already exists', 409);
  }

  const { dateOfBirth, ...rest } = input;
  return prisma.customer.update({
    where: { id },
    data: {
      ...rest,
      ...(dateOfBirth !== undefined ? { dateOfBirth: toDateOrUndefined(dateOfBirth) } : {}),
    },
  });
}

export async function deleteCustomer(id: number) {
  await getCustomerById(id);
  await prisma.customer.delete({ where: { id } });
}
