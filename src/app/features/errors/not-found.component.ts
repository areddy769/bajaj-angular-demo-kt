import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="center">
      <h2>404 — Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <a routerLink="/dashboard">Back to dashboard</a>
    </div>
  `,
  styles: [`.center { text-align: center; padding: 48px 16px; }`]
})
export class NotFoundComponent {}
