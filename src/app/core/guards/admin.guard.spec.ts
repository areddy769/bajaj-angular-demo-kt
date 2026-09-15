import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let auth: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'hasRole']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AdminGuard, { provide: AuthService, useValue: auth }]
    });
    guard = TestBed.inject(AdminGuard);
    router = TestBed.inject(Router);
  });

  it('allows ADMIN', () => {
    auth.isLoggedIn.and.returnValue(true);
    auth.hasRole.and.returnValue(true);
    expect(guard.canActivate()).toBe(true);
  });

  it('sends USER to /unauthorized', () => {
    auth.isLoggedIn.and.returnValue(true);
    auth.hasRole.and.returnValue(false);
    const result = guard.canActivate() as UrlTree;
    expect(router.serializeUrl(result)).toBe('/unauthorized');
  });

  it('sends logged-out visitors to /unauthorized', () => {
    auth.isLoggedIn.and.returnValue(false);
    const result = guard.canActivate() as UrlTree;
    expect(router.serializeUrl(result)).toBe('/unauthorized');
  });
});
