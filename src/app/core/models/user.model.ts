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

// What the backend returns on POST /api/auth/login
export interface LoginResponse {
  token: string;
  user: SessionUser;
}

// Slim session user (login payload) — full User adds createdAt/updatedAt.
export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// Payload for POST /api/users and PUT /api/users/:id
export interface UserFormValue {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
}
