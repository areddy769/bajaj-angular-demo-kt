import { Component } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="toasts" aria-live="polite">
      <div class="toast" [ngClass]="t.type" *ngFor="let t of notifications.toasts$ | async">
        <span>{{ t.message }}</span>
        <button type="button" (click)="notifications.dismiss(t.id)" aria-label="Dismiss">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 2l8 8M10 2l-8 8" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toasts { position: fixed; top: 70px; right: 16px; z-index: 1002; display: flex;
      flex-direction: column; gap: 8px; }
    .toast { padding: 12px 15px; border-radius: var(--radius-s); color: #fff; display: flex;
      gap: 12px; align-items: center; min-width: 250px; max-width: 340px;
      font-weight: 550; animation: rise-in 200ms ease-out; }
    .success { background: oklch(0.5 0.13 152); box-shadow: 0 8px 28px -8px oklch(0.6 0.15 152 / 0.7); }
    .error { background: oklch(0.5 0.16 24); box-shadow: 0 8px 28px -8px oklch(0.6 0.17 24 / 0.7); }
    .info { background: oklch(0.5 0.13 254); box-shadow: 0 8px 28px -8px oklch(0.6 0.15 254 / 0.7); }
    button { background: none; border: none; box-shadow: none; color: #fff; cursor: pointer;
      display: inline-flex; padding: 2px; }
    button:hover { filter: none; transform: none; opacity: 0.8; }
  `]
})
export class NotificationsComponent {
  constructor(public notifications: NotificationService) {}
}
