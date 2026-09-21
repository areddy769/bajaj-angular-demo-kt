export type UserRole = 'ADMIN' | 'USER';

export interface SessionUser {
id: number;
email: string;
name: string;
role: UserRole;
}

export interface LoginResponse {
token: string;
user: SessionUser;
}

export interface ApiSuccess<T> {
success: boolean;
message: string;
data: T;
}
