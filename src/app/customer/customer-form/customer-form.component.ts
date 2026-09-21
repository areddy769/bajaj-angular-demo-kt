import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';

@Component({
selector: 'app-customer-form',
templateUrl: './customer-form.component.html',
styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

customerForm!: FormGroup;
editMode = false;
customerId!: string;

loading = false;
errorMessage = '';

constructor(
private fb: FormBuilder,
private customerService: CustomerService,
private route: ActivatedRoute,
private router: Router
) {}

ngOnInit(): void {


this.customerForm = this.fb.group({
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  city: ['', Validators.required],
  customerType: ['', Validators.required],
  status: ['ACTIVE', Validators.required]
});

this.customerId = this.route.snapshot.paramMap.get('id') || '';

if (this.customerId) {
  this.editMode = true;
  this.loadCustomer();
}


}

loadCustomer(): void {


this.loading = true;

this.customerService.getCustomerById(this.customerId).subscribe({
  next: (response: any) => {

    const customer = response.data || response;

    this.customerForm.patchValue({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      mobile: customer.mobile || '',
      city: customer.city || '',
      customerType: customer.customerType || '',
      status: customer.status || 'ACTIVE'
    });

    this.loading = false;
  },

  error: (error: any) => {
    console.error(error);
    this.errorMessage = 'Unable to load customer details.';
    this.loading = false;
  }
});


}

onSubmit(): void {


if (this.customerForm.invalid) {
  this.customerForm.markAllAsTouched();
  return;
}

this.loading = true;
this.errorMessage = '';

const customerData = this.customerForm.value;

if (this.editMode) {

  this.customerService
    .updateCustomer(this.customerId, customerData)
    .subscribe({
      next: () => {
        this.router.navigate(['/customers']);
      },

      error: (error: any) => {
        console.error(error);
        this.errorMessage = 'Unable to update customer.';
        this.loading = false;
      }
    });

} else {

  this.customerService
    .createCustomer(customerData)
    .subscribe({
      next: () => {
        this.router.navigate(['/customers']);
      },

      error: (error: any) => {
        console.error(error);
        this.errorMessage = 'Unable to create customer.';
        this.loading = false;
      }
    });
}


}

cancel(): void {
this.router.navigate(['/customers']);
}
}
