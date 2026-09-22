
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { CustomerService } from 'src/app/core/services/Customer/customer.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  customerForm!: FormGroup;

  loading = false;

  submitted = false;

  serverError = '';

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
    private customerService: CustomerService,
    private router: Router,
    private noi: NotificationService,
    private load:LoadingService

  ) {}

  ngOnInit(): void {

    

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
          Validators.pattern(
            /^(?:\+91|0)?[6-9]\d{9}$/
          )
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
        [ Validators.required,
          Validators.maxLength(100)
        ]
      ],

       state: [
        'uttarpradesh',
        [ Validators.required,
          Validators.maxLength(30)
        ]
      ],

      address: [
        '',
        [ Validators.required,
          Validators.maxLength(500)
        ]
      ]

    });
  }


  
  get f() {
    return this.customerForm.controls;
  }


  hasError(field: string): boolean {

    const control = this.customerForm.get(field);

    return !!(
      control &&
      control.invalid &&
      (control.touched || this.submitted)
    );
  }


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


  submit(): void {

    this.submitted = true;

    this.serverError = '';

    this.customerForm.markAllAsTouched();

    if (this.customerForm.invalid) {
      return;
    }

    this.load.show()

    this.loading = true;

    const payload = this.customerForm.getRawValue();
    console.log(payload)

    this.customerService.create(payload).subscribe({

      next: (response) => {

        console.log(
          'Customer created:',
          response
        );

        this.load.hide();
        this.noi.success("customer added sucessfully");

        this.loading = false;

        this.router.navigate([
          '/customers'
        ]);
      },

      error: (error) => {

        console.log(
          'Create customer failed:',
          error
        );

        this.loading = false;

        this.noi.error(error)
      }

    });
  }


  cancel(): void {

    this.router.navigate([
      '/customers'
    ]);
  }


  
  resetForm(): void {

    this.submitted = false;

    this.serverError = '';

    this.customerForm.reset({

      firstName: '',

      lastName: '',

      email: '',

      mobile: '',

      pincode: '',

      gender: '',

      customerType: 'INDIVIDUAL',

      status: 'ACTIVE',

      city: '',

      address: ''

    });
  }

   canDeactivate(): boolean {

    if (this.customerForm.dirty) {

      return confirm(
        'You have unsaved changes. Are you sure you want to leave this page?'
      );

    }

    return true;
  }
}

