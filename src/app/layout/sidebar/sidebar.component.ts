import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <nav class="side">
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/customers" routerLinkActive="active">Customers</a>
      <a routerLink="/users" routerLinkActive="active" *ngIf="auth.hasRole('ADMIN')">Users</a>
    </nav>
  `,
  styles: [`
    .side { display: flex; flex-direction: column; gap: 4px; padding: 12px;
      background: #e8eaf6; min-height: calc(100vh - 96px); min-width: 160px; }
    a { padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #1a237e; }
    a.active { background: #c5cae9; font-weight: 700; }
  `]
})
export class SidebarComponent {
  constructor(public auth: AuthService) {}
}
