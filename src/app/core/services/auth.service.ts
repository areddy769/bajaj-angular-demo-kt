import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccess } from '../models/api-response.model';
import { LoginResponse, SessionUser, UserRole } from '../models/user.model';

const TOKEN_KEY = 'demo_token';
const USER_KEY = 'demo_user';

// Single source of truth for "who is logged in".
// Components read currentUser$ with the async pipe — no manual subscribe/unsubscribe.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject: BehaviorSubject<SessionUser | null>;

  /** Observable user state (emits null after logout). */
  readonly currentUser$: Observable<SessionUser | null>;

  constructor(private http: HttpClient) {
    // Survive a browser refresh by restoring the last session.
    this.currentUserSubject = new BehaviorSubject<SessionUser | null>(this.readStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /** POST /api/auth/login — the ONLY place credentials are checked (backend, never Angular). */
  login(email: string, password: string): Observable<ApiSuccess<LoginResponse>> {
    return this.http
      .post<ApiSuccess<LoginResponse>>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          this.currentUserSubject.next(res.data.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  get currentUser(): SessionUser | null {
    return this.currentUserSubject.value;
  }

  private readStoredUser(): SessionUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  }
}
