import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SessionUser } from '../../core/models/user.model';

@Component({
  selector: 'app-header',
  template: `
    <header class="topbar">
      <span class="mark" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 26 26" fill="none">
          <rect x="1" y="1" width="24" height="24" rx="7" fill="url(#hg)" opacity="0.9"/>
          <path d="M7 18V8h6a4 4 0 0 1 0 8H7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          <defs><linearGradient id="hg" x1="0" y1="0" x2="26" y2="26"><stop stop-color="#3b82f6"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
        </svg>
      </span>
      <span class="brand">Customer Portal</span>
      <span class="spacer"></span>
      <ng-container *ngIf="user$ | async as user">
        <span class="who">{{ user.name }}</span>
        <app-status-badge [status]="user.role"></app-status-badge>
        <button type="button" class="ghost" (click)="logout()">Logout</button>
      </ng-container>
    </header>
  `,
  styles: [`
    .topbar { display: flex; align-items: center; gap: 12px; padding: 0 20px; height: 60px;
      background: oklch(0.24 0.05 266 / 0.75); backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--line); position: relative; z-index: 20; }
    .mark { display: inline-flex; filter: drop-shadow(0 0 10px oklch(0.62 0.17 258 / 0.6)); }
    .brand { font-weight: 800; font-size: 16px; letter-spacing: -0.01em;
      background: linear-gradient(120deg, #fff, var(--cyan)); -webkit-background-clip: text;
      background-clip: text; color: transparent; }
    .spacer { flex: 1; }
    .who { font-size: 13px; color: var(--ink-2); }
    .ghost { background: transparent; border: 1px solid var(--line); color: var(--ink); box-shadow: none; }
    .ghost:hover { border-color: var(--brand); filter: none; }
  `]
})
export class HeaderComponent {
  user$: Observable<SessionUser | null>;

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.currentUser$;
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
