import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  serverError: string | null = null;

  

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,

    private notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });

    
    if (this.auth.isLogin()) {
     
      this.router.navigate(['/dashboard']);


    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  submit(){



    this.serverError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password } = this.form.value;


      this.auth
      .login(email, password)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.notifications.success(
            `Welcome, ${res.data.user.name}!`
          );

          this.router.navigate(['/dashboard']);

          
        },

        error: (err) => {
          if (err.status === 401) {
            this.serverError = 'Invalid email or password.';
          } else if (err.status === 403) {
            this.serverError =
              err.error?.message || 'Account is inactive.';
          } else if (err.status === 0) {
            this.serverError =
              'Cannot reach the API. Is the backend running?';
          } else {
            this.serverError =
              err.error?.message || 'Login failed. Try again.';
          }
        }
      });




    
   

    

  }

  
}