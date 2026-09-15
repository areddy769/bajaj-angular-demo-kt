import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [ngClass]="status?.toLowerCase()">{{ status }}</span>`,
  styles: [`
    .badge { display: inline-block; padding: 3px 11px; border-radius: 20px;
      font-size: 11.5px; font-weight: 750; letter-spacing: 0.04em; text-transform: uppercase; }
    .active { background: var(--success-bg); color: var(--success);
      box-shadow: 0 0 12px oklch(0.78 0.15 152 / 0.25); }
    .inactive { background: var(--danger-bg); color: var(--danger); }
    .admin { background: var(--info-bg); color: var(--info);
      box-shadow: 0 0 12px oklch(0.76 0.12 254 / 0.3); }
    .user { background: var(--violet-bg); color: var(--violet-ink); }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string | null = null;
}
