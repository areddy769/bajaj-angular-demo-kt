import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ConfirmDialogService, ConfirmRequest } from '../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="backdrop" *ngIf="request">
      <div class="dialog" role="alertdialog">
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
    .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.45);
      display: flex; align-items: center; justify-content: center; z-index: 1001; }
    .dialog { background: #fff; border-radius: 8px; padding: 20px 24px; width: 360px; }
    .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
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
