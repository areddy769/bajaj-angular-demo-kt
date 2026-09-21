import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    /*
     * Check whether current user is ADMIN
     */
    if (
      this.authService.hasRole('ADMIN')
    ) {
      return true;
    }

    /*
     * User is not ADMIN
     */
    this.router.navigate([
      '/dashboard'
    ]);

    return false;
  }

}