import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <nav class="side" aria-label="Primary">
      <span class="caption">Workspace</span>
      <a routerLink="/dashboard" routerLinkActive="active">
        <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1.5" y="1.5" width="5" height="5" rx="1"/><rect x="9.5" y="1.5" width="5" height="5" rx="1"/><rect x="1.5" y="9.5" width="5" height="5" rx="1"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/></svg>
        Dashboard
      </a>
      <a routerLink="/customers" routerLinkActive="active">
        <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="5" r="2.6"/><path d="M2.5 14c.6-2.8 2.8-4.2 5.5-4.2s4.9 1.4 5.5 4.2"/></svg>
        Customers
      </a>
      <a routerLink="/users" routerLinkActive="active" *ngIf="auth.hasRole('ADMIN')">
        <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="5.5" cy="5.5" r="2.2"/><path d="M1.5 13.5c.5-2.2 2.1-3.4 4-3.4s3.5 1.2 4 3.4"/><circle cx="11.5" cy="6" r="1.8"/><path d="M10.5 10.3c2 .1 3.4 1.2 3.9 3.2"/></svg>
        Users
        <span class="admin-tag">Admin</span>
      </a>
      <span class="caption foot-cap">Session</span>
      <div class="api-dot"><span class="pulse"></span>API :3000 live</div>
    </nav>
  `,
  styles: [`
    .side { display: flex; flex-direction: column; gap: 3px; padding: 16px 12px;
      background: oklch(0.22 0.045 266 / 0.7); backdrop-filter: blur(10px);
      border-right: 1px solid var(--line); min-height: calc(100vh - 102px); min-width: 200px; }
    .caption { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
      color: var(--ink-2); padding: 0 10px 8px; }
    .foot-cap { margin-top: auto; padding-top: 16px; }
    a { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px;
      text-decoration: none; color: var(--ink-2); font-weight: 550;
      transition: background-color 150ms ease-out, color 150ms ease-out, box-shadow 150ms ease-out; }
    a:hover { background: oklch(0.62 0.17 258 / 0.12); color: var(--ink); }
    a.active { background: var(--grad); color: #fff; font-weight: 700; box-shadow: var(--glow); }
    .admin-tag { margin-left: auto; font-size: 10.5px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; background: var(--violet-bg); color: var(--violet-ink);
      padding: 2px 8px; border-radius: 20px; }
    .api-dot { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--ink-2); padding: 0 10px; }
    .pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--success);
      box-shadow: 0 0 10px var(--success); animation: pulse 2s ease-out infinite; }
    @keyframes pulse { 50% { opacity: 0.45; } }
  `]
})
export class SidebarComponent {
  constructor(public auth: AuthService) {}
}
