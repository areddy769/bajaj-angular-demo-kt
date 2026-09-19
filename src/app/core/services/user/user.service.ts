import { Injectable } from '@angular/core';
import { backend } from '../api';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiSuccess, PagedResult, User, UserFormValue, UserQuery, UserStatus } from 'src/app/models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = `${backend.apiUrl}/users`;

  constructor(private http : HttpClient) { }
  
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
