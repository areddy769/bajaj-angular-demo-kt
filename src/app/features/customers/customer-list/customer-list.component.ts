import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];

  // Search
  searchText = '';

  // Filters
  status = '';
  city = '';
  customerType = '';

  // Sorting
  sortBy = '';
  sortOrder = 'asc';

  // Pagination
  page = 1;
  limit = 5;
  totalPages = 1;
  totalCustomers = 0;

  // Loading / Error
  loading = false;
  errorMessage = '';

  // Delete
  deleteTarget: Customer | null = null;
  deleting = false;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Load customers
  loadCustomers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.customerService.getCustomers(
      this.page,
      this.limit,
      this.searchText,
      this.status,
      this.city,
      this.customerType,
      this.sortBy,
      this.sortOrder
    ).subscribe({

      next: (response) => {

        this.loading = false;

        this.customers = response.data.items;

        this.totalCustomers =
          response.data.pagination.total;

        this.totalPages =
          response.data.pagination.totalPages;

      },

      error: (error) => {

        this.loading = false;

        console.log('Customer API Error:', error);

        if (error.status === 401) {

          this.errorMessage =
            'Session expired. Please login again.';

        } else if (error.status === 403) {

          this.errorMessage =
            'You are not authorized to view customers.';

        } else if (error.status === 404) {

          this.errorMessage =
            'Customer API endpoint not found.';

        } else if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to backend. Make sure the backend is running on port 3000.';

        } else {

          this.errorMessage =
            `Unable to load customers. Server returned ${error.status}.`;

        }

      }

    });

  }

  // Search
  onSearch(): void {

    this.page = 1;
    this.loadCustomers();

  }

  // Filter
  onFilter(): void {

    this.page = 1;
    this.loadCustomers();

  }

  // Sort
  onSort(): void {

    this.page = 1;
    this.loadCustomers();

  }

  // Next page
  nextPage(): void {

    if (this.page < this.totalPages) {

      this.page++;
      this.loadCustomers();

    }

  }

  // Previous page
  previousPage(): void {

    if (this.page > 1) {

      this.page--;
      this.loadCustomers();

    }

  }

  // Open delete confirmation
  deleteCustomer(customer: Customer): void {

    this.deleteTarget = customer;

  }

  // Cancel delete
  cancelDelete(): void {

    this.deleteTarget = null;

  }

  // Confirm delete
  confirmDelete(): void {

    if (!this.deleteTarget) {
      return;
    }

    this.deleting = true;
    this.errorMessage = '';

    const customerId = this.deleteTarget.id;

    this.customerService
      .deleteCustomer(customerId)
      .subscribe({

        next: () => {

          this.deleting = false;
          this.deleteTarget = null;

          this.loadCustomers();

        },

        error: (error) => {

          this.deleting = false;
          this.deleteTarget = null;

          console.log('Delete Customer Error:', error);

          if (error.status === 403) {

            this.errorMessage =
              'You are not authorized to delete customers.';

          } else if (error.status === 401) {

            this.errorMessage =
              'Session expired. Please login again.';

          } else if (error.status === 404) {

            this.errorMessage =
              'Customer not found.';

          } else if (error.status === 0) {

            this.errorMessage =
              'Unable to connect to backend.';

          } else {

            this.errorMessage =
              `Unable to delete customer. Server returned ${error.status}.`;

          }

        }

      });

  }

}