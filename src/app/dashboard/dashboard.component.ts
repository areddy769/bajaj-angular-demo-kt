
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../core/services/users/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalEmployees = 0;
  activeEmployees = 0;
  inactiveEmployees = 0;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadEmployeeCounts();
  }

  loadEmployeeCounts(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {

        console.log('USER API RESPONSE:', response);

        this.totalEmployees = response.data.pagination.totalItems;

        this.activeEmployees = response.data.items.filter(
          employee => employee.status === 'ACTIVE'
        ).length;

        this.inactiveEmployees = response.data.items.filter(
          employee => employee.status === 'INACTIVE'
        ).length;

        console.log('Total:', this.totalEmployees);
        console.log('Active:', this.activeEmployees);
        console.log('Inactive:', this.inactiveEmployees);
      },

      error: (error) => {
        console.error('USER API ERROR:', error);
      }
    });
  }

  manageCustomers(): void {
    this.router.navigate(['/customers']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');

    this.router.navigate(['/login']);
  }

  goToCustomers(): void {
    this.router.navigate(['/customers']);
  }
}

