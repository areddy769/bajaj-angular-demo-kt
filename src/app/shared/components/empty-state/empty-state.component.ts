import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty">
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8" stroke-linecap="round"/>
      </svg>
      <p class="title">{{ title }}</p>
      <p class="hint" *ngIf="hint">{{ hint }}</p>
    </div>
  `,
  styles: [`
    .empty { text-align: center; padding: 44px 16px; color: var(--ink-2);
      background: oklch(0.25 0.045 266 / 0.7); border: 1px dashed var(--line);
      border-radius: var(--radius); }
    .empty svg { color: var(--brand); filter: drop-shadow(0 0 8px oklch(0.62 0.17 258 / 0.5)); }
    .title { font-size: 15px; font-weight: 700; margin: 10px 0 4px; color: var(--ink); }
    .hint { margin: 0; font-size: 13px; }
  `]
})
export class EmptyStateComponent {
  @Input() title = 'No records found.';
  @Input() hint = '';
}
