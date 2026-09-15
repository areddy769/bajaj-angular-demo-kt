import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CustomerService } from '../../../core/services/customer.service';
import { NotificationService } from '../../../core/services/notification.service';
import { indianMobileValidator, pincodeValidator } from '../../../shared/validators/custom.validators';

// One form for Add + Edit. Edit mode = :id route param present → GET then patchValue.
@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;
  serverError: string | null = null;
  private customerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customersApi: CustomerService,
    private notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, indianMobileValidator()]],
      dateOfBirth: [''],
      gender: ['OTHER', Validators.required],
      city: ['', [Validators.required, Validators.maxLength(60)]],
      state: ['', [Validators.required, Validators.maxLength(60)]],
      pincode: ['', [Validators.required, pincodeValidator()]],
      customerType: ['INDIVIDUAL', Validators.required],
      status: ['ACTIVE', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.customerId = Number(idParam);
      this.customersApi.getById(this.customerId).subscribe({
        next: (res) => {
          const dob = res.data.dateOfBirth ? res.data.dateOfBirth.substring(0, 10) : '';
          this.form.patchValue({ ...res.data, dateOfBirth: dob });
        },
        error: () => {
          this.serverError = 'Could not load this customer.';
        }
      });
    }
  }

  field(name: string) {
    return this.form.get(name);
  }

  submit(): void {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = { ...this.form.value };
    if (!payload.dateOfBirth) delete payload.dateOfBirth;

    const request =
      this.isEdit && this.customerId
        ? this.customersApi.update(this.customerId, payload)
        : this.customersApi.create(payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.notifications.success(this.isEdit ? 'Customer updated.' : 'Customer created.');
        void this.router.navigate(['/customers']);
      },
      error: (err) => {
        // 400 validation details come from the backend; show the first message.
        this.serverError = err.error?.errors?.[0]?.message || err.error?.message || 'Save failed. Try again.';
      }
    });
  }

  cancel(): void {
    void this.router.navigate(['/customers']);
  }
}
