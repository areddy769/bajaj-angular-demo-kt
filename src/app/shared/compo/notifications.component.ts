import { Component } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="notifications" aria-live="polite">

      <div
        class="notification"
        *ngFor="let notification of notifications.toasts$ | async"
      >
        <span>{{ notification.message }}</span>

        <button
          type="button"
          (click)="notifications.dismiss(notification.id)"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

    </div>
  `,
  styles: [`
    .notifications {
      position: fixed;
      top: 70px;
      right: 20px;
      z-index: 1000;

      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .notification {
      min-width: 250px;
      max-width: 350px;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;

      padding: 12px 14px;

      background: #fff;
      border: 1px solid #ddd;
      border-radius: 6px;

      color: #333;
      font-size: 14px;

      animation: slideIn 0.25s ease-out;
    }

    button {
      border: none;
      background: none;
      padding: 0;

      color: #666;
      font-size: 18px;
      cursor: pointer;
    }

    button:hover {
      color: #222;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 500px) {
      .notifications {
        left: 15px;
        right: 15px;
      }

      .notification {
        min-width: auto;
        max-width: none;
      }
    }
  `]
})
export class NotificationsComponent {
  constructor(public notifications: NotificationService) {}
}