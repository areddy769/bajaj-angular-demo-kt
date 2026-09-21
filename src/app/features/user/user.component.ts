import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import {
  User,
  UserRole,
  UserStatus,
  UserQuery,
  Pagination
} from 'src/app/models/models';



import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class ManageComponent implements OnInit {

  /* =========================================
     Data
  ========================================== */

  users: User[] = [];

  pagination!: Pagination;


  /* =========================================
     Search
  ========================================== */

  searchForm!: FormGroup;


  /* =========================================
     Filters
  ========================================== */

  roles: UserRole[] = [
    'ADMIN',
    'USER'
  ];

  statuses: UserStatus[] = [
    'ACTIVE',
    'INACTIVE'
  ];


  /* =========================================
     Pagination
  ========================================== */

  page = 1;

  limit = 10;


  /* =========================================
     State
  ========================================== */

  loading = false;

  serverError = '';

  isAdmin = false;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private load: LoadingService,
    private noi: NotificationService
  ) {}


  ngOnInit(): void {

    /*
     * Check whether current
     * logged-in user is ADMIN.
     */
    this.isAdmin =
      this.authService.hasRole('ADMIN');


    /*
     * Create search form.
     */
    this.createSearchForm();


    /*
     * Initial API call.
     */
    this.loadUsers();
  }


  /* =========================================
     Search Form
  ========================================== */

  private createSearchForm(): void {

    this.searchForm = this.fb.group({

      search: [''],

      role: [''],

      status: ['']

    });
  }


  /* =========================================
     Load Users
  ========================================== */

  loadUsers(): void {

    this.loading = true;

    this.serverError = '';

    this.load.show();


    const formValue =
      this.searchForm.getRawValue();


    const query: UserQuery = {

      page: this.page,

      limit: this.limit,

      search:
        formValue.search?.trim() || undefined,

      role:
        formValue.role || undefined,

      status:
        formValue.status || undefined
    };


    this.userService
      .list(query)
      .subscribe({

        next: (response) => {

          console.log(
            'Users response:',
            response
          );


          /*
           * IMPORTANT:
           *
           * response.data is PagedResult<User>
           *
           * Therefore:
           *
           * response.data.items
           */
          this.users =
            response.data.items;


          this.pagination =
            response.data.pagination;


          this.loading = false;

          this.load.hide();
        },


        error: (error) => {

          console.error(
            'Failed to load users:',
            error
          );


          this.users = [];

          this.loading = false;

          this.load.hide();


          this.serverError =
            error?.error?.message ||
            'Unable to load users.';


          this.noi.error(
            this.serverError
          );
        }

      });
  }


  /* =========================================
     Search
  ========================================== */

  search(): void {

    /*
     * Every new search starts
     * from page 1.
     */
    this.page = 1;

    this.loadUsers();
  }


  /* =========================================
     Reset
  ========================================== */

  resetSearch(): void {

    this.searchForm.reset({

      search: '',

      role: '',

      status: ''

    });


    this.page = 1;

    this.loadUsers();
  }


  /* =========================================
     Pagination
  ========================================== */

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.pagination.totalPages ||
      page === this.page
    ) {
      return;
    }


    this.page = page;

    this.loadUsers();
  }


  previousPage(): void {

    if (this.page > 1) {

      this.page--;

      this.loadUsers();
    }
  }


  nextPage(): void {

    if (
      this.pagination &&
      this.page <
        this.pagination.totalPages
    ) {

      this.page++;

      this.loadUsers();
    }
  }


  /* =========================================
     Page Numbers
  ========================================== */

  get pages(): number[] {

    if (!this.pagination) {
      return [];
    }


    const total =
      this.pagination.totalPages;


    return Array.from(
      { length: total },
      (_, index) => index + 1
    );
  }


  /* =========================================
     Add User
  ========================================== */

  addUser(): void {

    if (!this.isAdmin) {
      return;
    }


    this.router.navigate([
      'user',
      'edit'
    ]);
  }


  /* =========================================
     View User
  ========================================== */

  viewUser(id: number): void {

    if (!this.isAdmin) {
      return;
    }


    this.router.navigate([

      'user',
      'edit',
       
      id
    ]);
  }


  /* =========================================
     Track By
  ========================================== */

  trackByUserId(
    index: number,
    user: User
  ): number {

    return user.id;
  }


  /* =========================================
     Date
  ========================================== */

  formatDate(
    date: string
  ): string {

    if (!date) {
      return '-';
    }


    return new Date(
      date
    ).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

}