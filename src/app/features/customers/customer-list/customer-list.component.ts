import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomerService } from '../../../core/services/customer.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { AuthService } from '../../../core/services/auth.service';
import { Customer } from '../../../core/models/customer.model';
import { Pagination } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  customers: Customer[] = [];
  pagination: Pagination = { page: 1, limit: 10, totalItems: 0, totalPages: 1 };
  loading = false;
  error: string | null = null;
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  private searchSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private customersApi: CustomerService,
    private notifications: NotificationService,
    private confirms: ConfirmDialogService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      status: [''],
      customerType: [''],
      city: ['']
    });

    // Debounced server-side search: typing doesn't hammer the API.
    this.searchSub = this.filterForm
      .get('search')!
      .valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.load(1));

    this.load(1);
  }

  load(page: number): void {
    this.loading = true;
    this.error = null;
    const f = this.filterForm.value;
    this.customersApi
      .list({
        page,
        limit: this.pagination.limit,
        search: f.search || undefined,
        status: f.status || undefined,
        city: f.city || undefined,
        customerType: f.customerType || undefined,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.customers = res.data.items;
          this.pagination = res.data.pagination;
        },
        error: () => {
          this.error = 'Unable to load customers. Try again.';
        }
      });
  }

  applyFilters(): void {
    this.load(1);
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', status: '', customerType: '', city: '' });
    this.load(1);
  }

  toggleSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.load(1);
  }

  /** Whether a column is the active sort (template draws a CSS triangle). */
  isSorted(field: string): boolean {
    return this.sortBy === field;
  }

  view(id: number): void {
    void this.router.navigate(['/customers', id]);
  }

  edit(id: number): void {
    void this.router.navigate(['/customers', id, 'edit']);
  }

  remove(customer: Customer): void {
    // Confirm → (only if confirmed) DELETE → refresh. take(1) via subscribe + immediate answer stream.
    const sub = this.confirms
      .confirm(`Delete ${customer.firstName} ${customer.lastName}? This cannot be undone.`)
      .subscribe((confirmed) => {
        sub.unsubscribe();
        if (!confirmed) return;
        this.customersApi.delete(customer.id).subscribe({
          next: () => {
            this.notifications.success('Customer deleted.');
            this.load(this.pagination.page);
          },
          error: (err) => {
            if (err.status !== 403) this.notifications.error('Delete failed. Try again.');
          }
        });
      });
  }

  ngOnDestroy(): void {
    // Manual subscription (valueChanges) must be torn down; async-pipe streams don't need this.
    this.searchSub?.unsubscribe();
  }
}
