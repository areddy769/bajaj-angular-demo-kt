import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccess } from '../models/api-response.model';
import { DashboardSummary } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<ApiSuccess<DashboardSummary>> {
    return this.http.get<ApiSuccess<DashboardSummary>>(`${environment.apiUrl}/dashboard/summary`);
  }
}
