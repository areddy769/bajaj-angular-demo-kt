import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';

// Add + Edit share this form. Password is required on create, optional on edit
// (backend only re-hashes when a new password is supplied).
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;
  serverError: string | null = null;
  private userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersApi: UserService,
    private notifications: NotificationService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEdit ? [Validators.minLength(6)] : [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required],
      status: ['ACTIVE', Validators.required]
    });

    if (idParam) {
      this.userId = Number(idParam);
      this.usersApi.getById(this.userId).subscribe({
        next: (res) => this.form.patchValue({ ...res.data, password: '' }),
        error: () => (this.serverError = 'Could not load this user.')
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
    if (this.isEdit && !payload.password) delete payload.password;

    const request =
      this.isEdit && this.userId
        ? this.usersApi.update(this.userId, payload)
        : this.usersApi.create(payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.notifications.success(this.isEdit ? 'User updated.' : 'User created.');
        void this.router.navigate(['/users']);
      },
      error: (err) => {
        this.serverError = err.error?.message || 'Save failed. Try again.';
      }
    });
  }

  cancel(): void {
    void this.router.navigate(['/users']);
  }
}
