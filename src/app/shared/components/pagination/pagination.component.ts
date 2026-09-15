import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="pager" *ngIf="totalPages > 1">
      <button type="button" class="secondary" [disabled]="page <= 1" (click)="go(page - 1)" aria-label="Previous page">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 3L5 8l5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Prev
      </button>
      <span>Page {{ page }} of {{ totalPages }} ({{ totalItems }} records)</span>
      <button type="button" class="secondary" [disabled]="page >= totalPages" (click)="go(page + 1)" aria-label="Next page">
        Next
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  `,
  styles: [`
    .pager { display: flex; gap: 12px; align-items: center; justify-content: center;
      margin: 18px 0 4px; color: var(--ink-2); }
    .pager button { display: inline-flex; align-items: center; gap: 6px; }
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
