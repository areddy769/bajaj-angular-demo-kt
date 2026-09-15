import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Authorization: "are you allowed?" — ADMIN only, everyone else goes to /unauthorized.
// Note: the backend re-checks this on every /api/users call. Guards protect
// navigation; the API protects data.
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isLoggedIn() && this.auth.hasRole('ADMIN')) {
      return true;
    }
    return this.router.createUrlTree(['/unauthorized']);
  }
}
