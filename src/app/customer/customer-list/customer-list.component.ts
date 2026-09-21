import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  Customer,
  CustomerService
} from '../../core/services/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.customerService.getCustomers().subscribe({

      next: (response) => {

        console.log('Customer API response:', response);

        this.customers = response.data.items;

        this.loading = false;
      },

      error: (error) => {

        console.error('Customer API error:', error);

        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Please login again.';
        } else if (error.status === 403) {
          this.errorMessage =
            'You are not authorized to access customers.';
        } else {
          this.errorMessage =
            'Unable to load customers.';
        }
      }

    });
  }

  editCustomer(id: number): void {
    this.router.navigate(['/customers/edit', id]);
  }

  deleteCustomer(id: number): void {

    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    this.customerService.deleteCustomer(id).subscribe({

      next: () => {

        alert('Customer deleted successfully.');

        this.loadCustomers();
      },

      error: (error) => {

        console.error('Delete error:', error);

        if (error.status === 401) {
          alert('Please login again.');
        } else if (error.status === 403) {
          alert('You are not authorized to delete this customer.');
        } else {
          alert('Delete failed.');
        }
      }

    });
  }

}
