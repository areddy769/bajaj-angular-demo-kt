import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';
import { Pagination } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit, OnDestroy {
  searchControl = this.fb.control('');
  users: User[] = [];
  pagination: Pagination = { page: 1, limit: 10, totalItems: 0, totalPages: 1 };
  loading = false;
  error: string | null = null;
  private searchSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private usersApi: UserService,
    private notifications: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchSub = this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.load(1));
    this.load(1);
  }

  load(page: number): void {
    this.loading = true;
    this.error = null;
    this.usersApi
      .list({ page, limit: this.pagination.limit, search: this.searchControl.value || undefined })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.users = res.data.items;
          this.pagination = res.data.pagination;
        },
        error: () => (this.error = 'Unable to load users. Try again.')
      });
  }

  edit(id: number): void {
    void this.router.navigate(['/users', id, 'edit']);
  }

  toggleStatus(user: User): void {
    const next = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.usersApi.updateStatus(user.id, next).subscribe({
      next: () => {
        this.notifications.success(`User ${next === 'ACTIVE' ? 'activated' : 'deactivated'}.`);
        this.load(this.pagination.page);
      },
      error: () => this.notifications.error('Status update failed.')
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }
}
