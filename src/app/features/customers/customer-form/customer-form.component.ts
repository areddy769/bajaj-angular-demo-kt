import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  customerForm: FormGroup;

  isEditMode = false;
  customerId: number | null = null;

  loading = false;
  saving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      customerType: ['', [Validators.required]],
      status: ['ACTIVE', [Validators.required]]
    });

  }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEditMode = true;
      this.customerId = Number(id);

      this.loadCustomer(this.customerId);

    }

  }

  loadCustomer(id: number): void {

    this.loading = true;
    this.errorMessage = '';

    this.customerService.getCustomerById(id).subscribe({

      next: (response) => {

        this.loading = false;

        const customer = response.data;

        this.customerForm.patchValue({

          firstName: customer.firstName,

          lastName: customer.lastName,

          email: customer.email,

          mobile: customer.mobile,

          dateOfBirth: customer.dateOfBirth
            ? customer.dateOfBirth.substring(0, 10)
            : '',

          gender: customer.gender,

          city: customer.city,

          state: customer.state,

          pincode: customer.pincode,

          customerType: customer.customerType,

          status: customer.status

        });

      },

      error: () => {

        this.loading = false;

        this.errorMessage = 'Unable to load customer information.';

      }

    });

  }

  onSubmit(): void {

    if (this.customerForm.invalid) {

      this.customerForm.markAllAsTouched();

      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const customerData = this.customerForm.getRawValue();

    // EDIT CUSTOMER
    if (this.isEditMode && this.customerId !== null) {

      this.customerService
        .updateCustomer(this.customerId, customerData)
        .subscribe({

          next: () => {

            this.saving = false;

            alert('Customer updated successfully.');

            this.router.navigate(['/customers']);

          },

          error: () => {

            this.saving = false;

            this.errorMessage = 'Unable to update customer.';

          }

        });

    }

    // ADD CUSTOMER
    else {

      this.customerService
        .createCustomer(customerData)
        .subscribe({

          next: () => {

            this.saving = false;

            alert('Customer created successfully.');

            this.router.navigate(['/customers']);

          },

          error: () => {

            this.saving = false;

            this.errorMessage = 'Unable to create customer.';

          }

        });

    }

  }

  goBack(): void {

    this.router.navigate(['/customers']);

  }

}