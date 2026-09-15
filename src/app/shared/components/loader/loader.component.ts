import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="overlay" *ngIf="loading.loading$ | async">
      <div class="spinner" role="status" aria-label="Loading"></div>
    </div>
  `,
  styles: [`
    .overlay { position: fixed; inset: 0; background: oklch(0.16 0.03 266 / 0.6);
      backdrop-filter: blur(2px); display: flex; align-items: center;
      justify-content: center; z-index: 1000; }
    .spinner { width: 48px; height: 48px; border-radius: 50%;
      border: 4px solid oklch(0.4 0.07 266); border-top-color: var(--cyan);
      box-shadow: 0 0 24px oklch(0.7 0.14 198 / 0.5);
      animation: spin 0.8s cubic-bezier(0.2, 0.7, 0.3, 1) infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoaderComponent {
  constructor(public loading: LoadingService) {}
}
