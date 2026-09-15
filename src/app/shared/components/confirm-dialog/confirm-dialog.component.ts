import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ConfirmDialogService, ConfirmRequest } from '../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="backdrop" *ngIf="request">
      <div class="dialog" role="alertdialog" aria-modal="true">
        <h3>{{ request.title }}</h3>
        <p>{{ request.message }}</p>
        <div class="actions">
          <button type="button" class="secondary" (click)="close(false)">Cancel</button>
          <button type="button" class="danger" (click)="close(true)">{{ request.confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .backdrop { position: fixed; inset: 0; background: oklch(0.14 0.03 266 / 0.7);
      backdrop-filter: blur(3px); display: flex; align-items: center;
      justify-content: center; z-index: 1001; padding: 16px; }
    .dialog { background: var(--surface); border: 1px solid var(--line); border-radius: 18px;
      padding: 24px; width: 390px; max-width: 100%; box-shadow: var(--shadow);
      animation: rise-in 200ms ease-out; }
    .dialog h3 { margin: 0 0 6px; }
    .dialog p { margin: 0; color: var(--ink-2); }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
  `]
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  request: ConfirmRequest | null = null;
  private sub: Subscription | null = null;

  constructor(private confirms: ConfirmDialogService) {}

  ngOnInit(): void {
    const stream: Observable<ConfirmRequest | null> = this.confirms.request$;
    this.sub = stream.subscribe((r) => (this.request = r));
  }

  close(answer: boolean): void {
    this.confirms.answer(answer);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
