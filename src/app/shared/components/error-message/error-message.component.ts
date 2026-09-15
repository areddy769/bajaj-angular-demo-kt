import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="error-box" *ngIf="message">
      <p>{{ message }}</p>
      <button type="button" class="link" *ngIf="retryText" (click)="retry.emit()">{{ retryText }}</button>
    </div>
  `,
  styles: [`
    .error-box { background: #fdecea; border: 1px solid #f5c6cb; color: #a94442;
      padding: 12px 16px; border-radius: 6px; margin: 12px 0; }
    .link { background: none; border: none; color: #1976d2; cursor: pointer; padding: 0; }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
  @Input() retryText: string | null = null;
  @Output() retry = new EventEmitter<void>();
}
