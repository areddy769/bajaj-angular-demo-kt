import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-error-notification',
  template: `
    <div class="error-notification" role="alert" *ngIf="visible">
      <span>{{ message }}</span>
    </div>
  `,
  styles: [`
    .error-notification {
      position: fixed;
      top: 70px;
      right: 20px;
      z-index: 1000;

      min-width: 250px;
      max-width: 350px;

      padding: 12px 14px;

      background: #fff;
      border: 1px solid #ddd;
      border-radius: 6px;

      color: #555;
      font-size: 14px;

      animation:
        slideIn 0.25s ease-out,
        slideOut 0.25s ease-in 2.25s forwards;
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

    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }

      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }

    @media (max-width: 500px) {
      .error-notification {
        left: 15px;
        right: 15px;

        min-width: auto;
        max-width: none;
      }
    }
  `]
})
export class ErrorNotificationComponent implements OnChanges, OnDestroy {
  @Input() message: string | null = null;

  visible = false;
  private timer?: ReturnType<typeof setTimeout>;

  ngOnChanges(): void {
    clearTimeout(this.timer);

    if (!this.message) {
      this.visible = false;
      return;
    }

    this.visible = true;
    this.timer = setTimeout(() => (this.visible = false), 2500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}