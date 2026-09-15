import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let backend: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AuthService);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
    localStorage.clear();
  });

  it('stores token + user on successful login', () => {
    service.login('admin@example.com', 'Admin@123').subscribe((res) => {
      expect(res.data.token).toBe('jwt-token');
    });

    const req = backend.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({
      success: true,
      message: 'Login successful',
      data: {
        token: 'jwt-token',
        user: { id: 1, name: 'Admin', email: 'admin@example.com', role: 'ADMIN', status: 'ACTIVE' }
      }
    });

    expect(service.getToken()).toBe('jwt-token');
    expect(service.isLoggedIn()).toBe(true);
    expect(service.hasRole('ADMIN')).toBe(true);
  });

  it('clears state on logout', () => {
    localStorage.setItem('bajaj_demo_token', 'x');
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });
});
