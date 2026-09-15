import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SessionUser } from '../../core/models/user.model';

@Component({
  selector: 'app-header',
  template: `
    <header class="topbar">
      <span class="brand">Bajaj Customer Portal</span>
      <span class="spacer"></span>
      <ng-container *ngIf="user$ | async as user">
        <span class="who">{{ user.name }}</span>
        <app-status-badge [status]="user.role"></app-status-badge>
        <button type="button" (click)="logout()">Logout</button>
      </ng-container>
    </header>
  `,
  styles: [`
    .topbar { display: flex; align-items: center; gap: 12px; background: #0d47a1;
      color: #fff; padding: 0 16px; height: 56px; }
    .brand { font-weight: 700; }
    .spacer { flex: 1; }
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
