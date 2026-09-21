
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerService } from 'src/app/core/services/Customer/customer.service';

import {
  Customer,
  CustomerQuery,
  Pagination
} from 'src/app/models/models';

@Component({
  selector: 'app-customers',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomersComponent implements OnInit {

  customers: Customer[] = [];

  loading = false;

  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  };

  query: CustomerQuery = {
    page: 1,
    limit: 10,
    search: '',
    status: '',
    city: '',
    customerType: '',
    sortBy: 'firstName',
    sortOrder: 'asc'
  };

  statuses = [
    'ACTIVE',
    'INACTIVE'
  ];

  cities = [
    'Pune',
    'Mumbai',
    'Delhi'
  ];

  customerTypes = [
    'INDIVIDUAL',
    'BUSINESS'
  ];

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

 
  loadCustomers(): void {

    this.loading = true;

    this.customerService
      .list(this.query)
      .subscribe({

        next: (response) => {

          console.log('Customers response:', response);

          const result = response.data;

          this.customers = result.items || [];

          this.pagination = result.pagination;

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Failed to load customers:',
            error
          );

          console.error(
            'Backend error:',
            error?.error
          );

          this.customers = [];

          this.loading = false;
        }

      });
  }

  search(): void {

    this.query.page = 1;

    this.loadCustomers();
  }

 
  filterChanged(): void {

    this.query.page = 1;

    this.loadCustomers();
  }

 
  clearFilters(): void {

    this.query.search = '';

    this.query.status = '';

    this.query.city = '';

    this.query.customerType = '';

    this.query.page = 1;

    this.loadCustomers();
  }


  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.pagination.totalPages ||
      page === this.pagination.page
    ) {
      return;
    }

    this.query.page = page;

    this.loadCustomers();
  }

  
  addCustomer(): void {

    this.router.navigate([
      '/customers',
      'new'
    ]);
  }

 
  openCustomer(id: number): void {

    this.router.navigate([

      '/customers',
      'edit',
      
      id
    ]);
  }

  
  trackById(
    index: number,
    customer: Customer
  ): number {

    return customer.id;
  }
}

