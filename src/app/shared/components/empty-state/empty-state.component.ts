import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty">
      <p class="title">{{ title }}</p>
      <p class="hint" *ngIf="hint">{{ hint }}</p>
    </div>
  `,
  styles: [`
    .empty { text-align: center; padding: 32px 16px; color: #607d8b; }
    .title { font-size: 16px; font-weight: 600; margin: 0 0 4px; }
    .hint { margin: 0; font-size: 13px; }
  `]
})
export class EmptyStateComponent {
  @Input() title = 'No records found.';
  @Input() hint = '';
}
