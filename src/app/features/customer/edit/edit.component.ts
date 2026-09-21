import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomerService } from 'src/app/core/services/Customer/customer.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  customerForm!: FormGroup;

  customerId!: number;

  loading = false;
  submitted = false;
  editMode = false;

  serverError = '';

  isAdmin = false;

  genders = [
    'MALE',
    'FEMALE',
    'OTHER'
  ];

  customerTypes = [
    'INDIVIDUAL',
    'BUSINESS'
  ];

  statuses = [
    'ACTIVE',
    'INACTIVE'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private authService: AuthService,
    private load: LoadingService,
    private noi: NotificationService
  ) {}

  ngOnInit(): void {

    this.createForm();

    // Check current logged-in user's role
    this.isAdmin = this.authService.hasRole('ADMIN');

    // Get :id from /customers/:id
    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      if (!id || isNaN(id)) {
        this.serverError = 'Invalid customer ID';
        return;
      }

      this.customerId = id;

      this.loadCustomer(id);
    });
  }


  /**
   * Create reactive form
   */
  private createForm(): void {

    this.customerForm = this.fb.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?:\+91|0)?[6-9]\d{9}$/)
        ]
      ],

      pincode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{6}$/)
        ]
      ],

      gender: [
        '',
        [
          Validators.required
        ]
      ],

      customerType: [
        'INDIVIDUAL',
        [
          Validators.required
        ]
      ],

      status: [
        'ACTIVE',
        [
          Validators.required
        ]
      ],

      city: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      state: [
        '',
        [
          Validators.required,
          Validators.maxLength(30)
        ]
      ],

      address: [
        '',
        [
          // Validators.required,
          Validators.maxLength(500)
        ]
      ]
    });

    // Initially the form is READ ONLY
    this.customerForm.disable();
  }


  /**
   * Fetch customer by ID
   */
  private loadCustomer(id: number): void {

    this.loading = true;
    this.serverError = '';

    this.load.show();

    this.customerService.getById(id).subscribe({

      next: (response) => {

        console.log('Customer:', response);

        const customer = response.data;

        this.customerForm.patchValue({

          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          mobile: customer.mobile,
          pincode: customer.pincode,
          gender: customer.gender,
          customerType: customer.customerType,
          status: customer.status,
          city: customer.city,
          state: customer.state,
          // address: customer.address

        });

        // Keep form frozen
        this.customerForm.disable();

        this.loading = false;
        this.load.hide();
      },

      error: (error) => {

        console.error(
          'Failed to load customer:',
          error
        );

        this.loading = false;
        this.load.hide();

        this.serverError =
          error?.error?.message ||
          'Unable to load customer.';
      }
    });
  }


  /**
   * Easy access to form controls
   */
  get f() {
    return this.customerForm.controls;
  }


  /**
   * Check field error
   */
  hasError(field: string): boolean {

    const control = this.customerForm.get(field);

    return !!(
      control &&
      control.invalid &&
      (control.touched || this.submitted)
    );
  }


  /**
   * Validation message
   */
  getErrorMessage(field: string): string {

    const control = this.customerForm.get(field);

    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {

      switch (field) {

        case 'firstName':
          return 'First name is required';

        case 'lastName':
          return 'Last name is required';

        case 'email':
          return 'Email is required';

        case 'mobile':
          return 'Mobile number is required';

        case 'pincode':
          return 'Pincode is required';

        case 'gender':
          return 'Gender is required';

        case 'customerType':
          return 'Customer type is required';

        case 'status':
          return 'Status is required';

        case 'city':
          return 'City is required';

        case 'state':
          return 'State is required';

        case 'address':
          return 'Address is required';
      }
    }

    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }

    if (control.errors['pattern']) {

      switch (field) {

        case 'mobile':
          return 'Enter a valid Indian mobile number';

        case 'pincode':
          return 'Pincode must be exactly 6 digits';
      }
    }

    if (control.errors['minlength']) {
      return 'This field is too short';
    }

    if (control.errors['maxlength']) {
      return 'This field is too long';
    }

    return 'Invalid value';
  }


  /**
   * Enable editing
   */
  enableEdit(): void {

    this.editMode = true;

    this.submitted = false;
    this.serverError = '';

    this.customerForm.enable();
  }


  /**
   * Cancel editing
   *
   * Reload original customer data
   */
  cancelEdit(): void {

    this.editMode = false;
    this.submitted = false;
    this.serverError = '';

    this.customerForm.disable();

    // Reload original data from server
    this.loadCustomer(this.customerId);
  }


  /**
   * Update customer
   */
  update(): void {

    this.submitted = true;
    this.serverError = '';

    this.customerForm.markAllAsTouched();

    if (this.customerForm.invalid) {
      return;
    }

    this.loading = true;
    this.load.show();

    const payload = this.customerForm.getRawValue();

    console.log('Update payload:', payload);

    this.customerService.update(
      this.customerId,
      payload
    ).subscribe({

      next: (response) => {

        console.log(
          'Customer updated:',
          response
        );

        this.loading = false;
        this.load.hide();

        this.editMode = false;

        this.customerForm.disable();

        this.noi.success(
          'Customer updated successfully'
        );
      },

      error: (error) => {

        console.error(
          'Update customer failed:',
          error
        );

        this.loading = false;
        this.load.hide();

        this.serverError =
          error?.error?.message ||
          'Unable to update customer.';

        this.noi.error(
          this.serverError
        );
      }
    });
  }


  /**
   * Delete customer
   */
  deleteCustomer(): void {

    if (!this.isAdmin) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this customer?'
    );

    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.load.show();

    this.customerService.delete(
      this.customerId
    ).subscribe({

      next: () => {

        this.loading = false;
        this.load.hide();

        this.noi.success(
          'Customer deleted successfully'
        );

        this.router.navigate([
          '/customers'
        ]);
      },

      error: (error) => {

        console.error(
          'Delete customer failed:',
          error
        );

        this.loading = false;
        this.load.hide();

        this.noi.error(
          error?.error?.message ||
          'Unable to delete customer.'
        );
      }
    });
  }


  /**
   * Back to customer list
   */
  back(): void {

    this.router.navigate([
      '/customers'
    ]);
  }
}