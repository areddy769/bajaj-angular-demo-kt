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
    .overlay { position: fixed; inset: 0; background: rgba(255,255,255,.6);
      display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .spinner { width: 44px; height: 44px; border-radius: 50%;
      border: 4px solid #cfd8dc; border-top-color: #1976d2; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoaderComponent {
  constructor(public loading: LoadingService) {}
}
