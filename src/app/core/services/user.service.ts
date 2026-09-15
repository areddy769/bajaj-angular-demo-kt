import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccess, PagedResult } from '../models/api-response.model';
import { User, UserFormValue, UserRole, UserStatus } from '../models/user.model';

export interface UserQuery {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole | '';
  status?: UserStatus | '';
}

// ADMIN-only endpoints — the backend enforces this too (guards alone are not enough).
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  list(query: UserQuery): Observable<ApiSuccess<PagedResult<User>>> {
    let params = new HttpParams().set('page', query.page).set('limit', query.limit);
    if (query.search) params = params.set('search', query.search);
    if (query.role) params = params.set('role', query.role);
    if (query.status) params = params.set('status', query.status);
    return this.http.get<ApiSuccess<PagedResult<User>>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<ApiSuccess<User>> {
    return this.http.get<ApiSuccess<User>>(`${this.baseUrl}/${id}`);
  }

  create(payload: UserFormValue): Observable<ApiSuccess<User>> {
    return this.http.post<ApiSuccess<User>>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<UserFormValue>): Observable<ApiSuccess<User>> {
    return this.http.put<ApiSuccess<User>>(`${this.baseUrl}/${id}`, payload);
  }

  updateStatus(id: number, status: UserStatus): Observable<ApiSuccess<User>> {
    return this.http.patch<ApiSuccess<User>>(`${this.baseUrl}/${id}/status`, { status });
  }
}
