import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginError = false;
  errorMessage = '';
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login(email: string, password: string): void {

    this.loginError = false;
    this.errorMessage = '';

    console.log('EMAIL FROM FORM:', email);
    console.log('PASSWORD FROM FORM:', password);

    if (!email || !password) {
      this.loginError = true;
      this.errorMessage = 'Please enter Email ID and Password.';
      return;
    }

    this.loading = true;

    this.authService.login(email, password).subscribe({

      next: (response) => {

        console.log('LOGIN API RESPONSE:', response);

        this.loading = false;

        if (response.success && response.data?.token) {

          console.log('TOKEN RECEIVED');
          console.log('USER:', response.data.user);

          this.router.navigate(['/dashboard']);

        } else {

          this.loginError = true;
          this.errorMessage = response.message || 'Login failed.';
        }
      },

      error: (error) => {

        console.error('LOGIN API ERROR:', error);
        console.error('BACKEND ERROR BODY:', error?.error);

        this.loading = false;
        this.loginError = true;

        if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Unable to connect to login API.';
        }
      }
    });
  }
}