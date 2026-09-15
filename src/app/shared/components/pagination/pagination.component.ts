import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="pager" *ngIf="totalPages > 1">
      <button type="button" [disabled]="page <= 1" (click)="go(page - 1)">‹ Prev</button>
      <span>Page {{ page }} of {{ totalPages }} ({{ totalItems }} records)</span>
      <button type="button" [disabled]="page >= totalPages" (click)="go(page + 1)">Next ›</button>
    </div>
  `,
  styles: [`
    .pager { display: flex; gap: 12px; align-items: center; justify-content: center; margin: 16px 0; }
    button:disabled { opacity: .4; cursor: not-allowed; }
  `]
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Output() pageChange = new EventEmitter<number>();

  go(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.page) {
      this.pageChange.emit(page);
    }
  }
}
