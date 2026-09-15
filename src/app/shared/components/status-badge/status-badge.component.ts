import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [ngClass]="status?.toLowerCase()">{{ status }}</span>`,
  styles: [`
    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px;
      font-size: 12px; font-weight: 600; }
    .active { background: #e8f5e9; color: #2e7d32; }
    .inactive { background: #fce4ec; color: #c62828; }
    .admin { background: #e3f2fd; color: #1565c0; }
    .user { background: #f3e5f5; color: #6a1b9a; }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string | null = null;
}
