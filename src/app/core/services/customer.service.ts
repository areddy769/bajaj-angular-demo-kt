import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccess, PagedResult } from '../models/api-response.model';
import { Customer, CustomerQuery } from '../models/customer.model';

// Thin HTTP wrapper — components call this, never HttpClient directly.
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  list(query: CustomerQuery): Observable<ApiSuccess<PagedResult<Customer>>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('limit', query.limit)
      .set('sortBy', query.sortBy)
      .set('sortOrder', query.sortOrder);
    if (query.search) params = params.set('search', query.search);
    if (query.status) params = params.set('status', query.status);
    if (query.city) params = params.set('city', query.city);
    if (query.customerType) params = params.set('customerType', query.customerType);
    return this.http.get<ApiSuccess<PagedResult<Customer>>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<ApiSuccess<Customer>> {
    return this.http.get<ApiSuccess<Customer>>(`${this.baseUrl}/${id}`);
  }

  create(payload: Partial<Customer>): Observable<ApiSuccess<Customer>> {
    return this.http.post<ApiSuccess<Customer>>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<Customer>): Observable<ApiSuccess<Customer>> {
    return this.http.put<ApiSuccess<Customer>>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<ApiSuccess<null>> {
    return this.http.delete<ApiSuccess<null>>(`${this.baseUrl}/${id}`);
  }
}
