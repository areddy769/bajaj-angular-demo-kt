import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="error-box" *ngIf="message" role="alert">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5" stroke-linecap="round"/><circle cx="8" cy="11" r="0.6" fill="currentColor"/>
      </svg>
      <p>{{ message }}</p>
      <button type="button" class="link" *ngIf="retryText" (click)="retry.emit()">{{ retryText }}</button>
    </div>
  `,
  styles: [`
    .error-box { display: flex; align-items: center; gap: 10px; background: var(--danger-bg);
      border: 1px solid oklch(0.7 0.17 24 / 0.45); color: var(--danger);
      padding: 12px 16px; border-radius: var(--radius-s); margin: 12px 0;
      box-shadow: 0 6px 20px -8px oklch(0.7 0.17 24 / 0.5); }
    .error-box p { margin: 0; flex: 1; font-weight: 550; }
    .link { background: none; border: none; box-shadow: none; color: var(--danger); cursor: pointer;
      padding: 0; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
    .link:hover { filter: none; transform: none; }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
  @Input() retryText: string | null = null;
  @Output() retry = new EventEmitter<void>();
}
