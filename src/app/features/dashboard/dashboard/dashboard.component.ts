import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  totalCustomers = 0;
  activeCustomers = 0;
  inactiveCustomers = 0;
  totalUsers = 0;

  loading = false;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getSummary().subscribe({
      next: (response) => {
        this.loading = false;

        const data = response.data;

        this.totalCustomers = data.totalCustomers;
        this.activeCustomers = data.activeCustomers;
        this.inactiveCustomers = data.inactiveCustomers;
        this.totalUsers = data.totalUsers;
      },

      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load dashboard data.';
      }
    });
  }
}