import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Attaches `Authorization: Bearer <token>` so individual services never do it manually.
// Skips the login call itself (no token exists yet).
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.includes('/auth/login')) {
      return next.handle(req);
    }
    const token = this.auth.getToken();
    if (!token) {
      return next.handle(req);
    }
    const authed = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(authed);
  }
}
