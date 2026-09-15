import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', ['getToken']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('attaches Bearer token to API requests', () => {
    auth.getToken.and.returnValue('abc123');
    http.get('/api/customers').subscribe();
    const req = backend.expectOne('/api/customers');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('skips the login request', () => {
    auth.getToken.and.returnValue('abc123');
    http.post('/api/auth/login', {}).subscribe();
    const req = backend.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('sends requests without a header when logged out', () => {
    auth.getToken.and.returnValue(null);
    http.get('/api/customers').subscribe();
    const req = backend.expectOne('/api/customers');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
