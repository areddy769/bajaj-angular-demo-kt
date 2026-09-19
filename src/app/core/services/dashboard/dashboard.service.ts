import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiSuccess, DashboardSummary } from 'src/app/models/models';
import { backend } from '../api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http : HttpClient) { }


  getSummary():Observable<ApiSuccess<DashboardSummary>>{
    return this.http.get<ApiSuccess<DashboardSummary>>(`${backend.apiUrl}/dashboard/summary`);
  }
}
