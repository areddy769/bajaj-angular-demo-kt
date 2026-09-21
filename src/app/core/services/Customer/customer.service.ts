import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiSuccess,
  Customer,
  CustomerQuery,
  PagedResult
} from 'src/app/models/models';

import { backend } from '../api';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly baseUrl = `${backend.apiUrl}/customers`;

  constructor(
    private http: HttpClient
  ) {}

  list(
    query: CustomerQuery
  ): Observable<ApiSuccess<PagedResult<Customer>>> {

    let params = new HttpParams()
      .set('page', query.page.toString())
      .set('limit', query.limit.toString())
      .set('sortBy', query.sortBy)
      .set('sortOrder', query.sortOrder);

    if (query.search?.trim()) {
      params = params.set(
        'search',
        query.search.trim()
      );
    }

    if (query.status) {
      params = params.set(
        'status',
        query.status
      );
    }

    if (query.city) {
      params = params.set(
        'city',
        query.city
      );
    }

    if (query.customerType) {
      params = params.set(
        'customerType',
        query.customerType
      );
    }

    return this.http.get<
      ApiSuccess<PagedResult<Customer>>
    >(
      this.baseUrl,
      { params }
    );
  }


  getById(
    id: number
  ): Observable<ApiSuccess<Customer>> {

    return this.http.get<
      ApiSuccess<Customer>
    >(
      `${this.baseUrl}/${id}`
    );
  }


  create(
    payload: Partial<Customer>
  ): Observable<ApiSuccess<Customer>> {

    return this.http.post<
      ApiSuccess<Customer>
    >(
      this.baseUrl,
      payload
    );
  }


  update(
    id: number,
    payload: Partial<Customer>
  ): Observable<ApiSuccess<Customer>> {

    return this.http.put<
      ApiSuccess<Customer>
    >(
      `${this.baseUrl}/${id}`,
      payload
    );
  }


  delete(
    id: number
  ): Observable<ApiSuccess<null>> {

    return this.http.delete<
      ApiSuccess<null>
    >(
      `${this.baseUrl}/${id}`
    );
  }
}