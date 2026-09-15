import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let auth: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, { provide: AuthService, useValue: auth }]
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('allows authenticated users', () => {
    auth.isLoggedIn.and.returnValue(true);
    expect(guard.canActivate()).toBe(true);
  });

  it('redirects unauthenticated users to /login with returnUrl', () => {
    auth.isLoggedIn.and.returnValue(false);
    const result = guard.canActivate() as UrlTree;
    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result)).toContain('/login');
  });
});
