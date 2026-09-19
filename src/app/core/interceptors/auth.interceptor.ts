import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';


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
    console.log("authenticated")
    return next.handle(authed);
  }
}