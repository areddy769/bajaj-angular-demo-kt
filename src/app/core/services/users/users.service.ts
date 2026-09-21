import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { backend } from '../../api';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface UserPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface UsersData {
  items: Employee[];
  pagination: UserPagination;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: UsersData;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(
      `${backend.apiUrl}/users`
    );
  }
}

