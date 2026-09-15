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

// Query params for GET /api/customers (server-side search/filter/sort/pagination)
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
