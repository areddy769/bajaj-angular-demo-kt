import { Component } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="toasts">
      <div class="toast" [ngClass]="t.type" *ngFor="let t of notifications.toasts$ | async">
        <span>{{ t.message }}</span>
        <button type="button" (click)="notifications.dismiss(t.id)" aria-label="Dismiss">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toasts { position: fixed; top: 64px; right: 16px; z-index: 1002; display: flex;
      flex-direction: column; gap: 8px; }
    .toast { padding: 10px 14px; border-radius: 6px; color: #fff; display: flex;
      gap: 12px; align-items: center; min-width: 240px; }
    .success { background: #2e7d32; } .error { background: #c62828; } .info { background: #1565c0; }
    button { background: none; border: none; color: #fff; font-size: 16px; cursor: pointer; }
  `]
})
export class NotificationsComponent {
  constructor(public notifications: NotificationService) {}
}
