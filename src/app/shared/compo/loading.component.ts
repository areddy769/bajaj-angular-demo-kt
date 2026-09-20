import { Component, Input } from '@angular/core';
// import { Observable, of } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading/loading.service';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading" *ngIf="load.loading$ | async">
      <span class="spinner"></span>
      
    </div>
  `,
  styles: [`
    .loading {
      position: fixed;
      top: 20px;
      right: 20px;

      display: flex;
      align-items: center;
      gap: 10px;

      padding: 10px 16px;

      background: #fff;
      border: 1px solid #ddd;
      border-radius: 6px;

      font-size: 14px;
      color: #333;

      z-index: 9999;
    }

    .spinner {
      width: 16px;
      height: 16px;

      border: 2px solid #ddd;
      border-top-color: #333;

      border-radius: 50%;

      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingComponent {

     
    constructor(public load:LoadingService){

    }


}