import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { ApiError } from 'src/app/models/models';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    // private notifications: NotificationService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const backendMessage = (err.error as ApiError | undefined)?.message;

        // if (err.status === 401 && !req.url.includes('/auth/login')) {
        //   this.auth.logout();
        //   this.notifications.error('Session expired. Please log in again.');
        //   void this.router.navigate(['/login']);
        // } else if (err.status === 403) {
        //   void this.router.navigate(['/unauthorized']);
        // } else if (err.status === 404) {
        //   this.notifications.error(backendMessage || 'Requested record was not found.');
        // } else if (err.status >= 500) {
        //   this.notifications.error('Something went wrong on the server. Try again.');
        // } else if (err.status === 0) {
        //   this.notifications.error('Cannot reach the API. Is the backend running on :3000?');
        // }
        console.log("error")
        console.log(backendMessage);

        return throwError(() => err);
      })
    );
  }
}