import { z } from 'zod';

// Indian mobile: 10 digits starting with 6-9 (allows optional +91 / 0 prefix)
const mobileRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;

export const customerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email'),
  mobile: z.string().regex(mobileRegex, 'Invalid Indian mobile number'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  city: z.string().min(2, 'City is required').max(60),
  state: z.string().min(2, 'State is required').max(60),
  pincode: z.string().regex(pincodeRegex, 'Pincode must be a 6-digit number'),
  customerType: z.enum(['INDIVIDUAL', 'BUSINESS']),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export type CustomerInput = z.infer<typeof customerSchema>;

// For PUT we allow the same shape (full update). Fresher-friendly: reuse schema.
export const updateCustomerSchema = customerSchema.partial();

const sortableFields = ['firstName', 'lastName', 'createdAt', 'status'] as const;

export const customerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  city: z.string().trim().optional(),
  customerType: z.enum(['INDIVIDUAL', 'BUSINESS']).optional(),
  sortBy: z.enum(sortableFields as unknown as [string, ...string[]]).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const SORTABLE_CUSTOMER_FIELDS = sortableFields as readonly string[];
