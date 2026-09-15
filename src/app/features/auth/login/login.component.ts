import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  serverError: string | null = null;
  private returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    if (this.auth.isLoggedIn()) {
      void this.router.navigate([this.returnUrl]);
    }
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  submit(): void {
    this.serverError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { email, password } = this.form.value;
    this.auth
      .login(email, password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.notifications.success(`Welcome, ${res.data.user.name}!`);
          void this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          if (err.status === 401) this.serverError = 'Invalid email or password.';
          else if (err.status === 403) this.serverError = err.error?.message || 'Account is inactive.';
          else if (err.status === 0) this.serverError = 'Cannot reach the API. Is the backend running?';
          else this.serverError = err.error?.message || 'Login failed. Try again.';
        }
      });
  }
}
