
export interface ApiSuccess<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PagedResult<T> {
  items: T[];
  pagination: Pagination;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type CustomerType = 'INDIVIDUAL' | 'BUSINESS';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE';

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string | null;
  gender: Gender;
  city: string;
  state: string;
  pincode: string;
  customerType: CustomerType;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerQuery {
  page: number;
  limit: number;
  search?: string;
  status?: CustomerStatus | '';
  city?: string;
  customerType?: CustomerType | '';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface DashboardSummary {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  totalUsers: number;
}

export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: SessionUser;
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserFormValue {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserQuery {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole | '';
  status?: UserStatus | '';
}
