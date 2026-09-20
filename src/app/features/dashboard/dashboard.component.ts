import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { DashboardSummary } from 'src/app/models/models';

// import { DashboardService } from '../../../core/services/dashboard.service';
// import { DashboardSummary } from '../../../core/models/dashboard.model';

interface DashboardState {
  loading: boolean;
  error: string | null;
  summary: DashboardSummary | null;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  state$!: Observable<DashboardState>;

  constructor(
    private dashboard: DashboardService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.state$ = this.dashboard.getSummary().pipe(
      map((res) => ({
        loading: false,
        error: null,
        summary: res.data
      })),

      catchError(() =>
        of({
          loading: false,
          error: 'Unable to load dashboard. Try again.',
          summary: null
        })
      ),

      startWith({
        loading: true,
        error: null,
        summary: null
      })
    );
  }
}