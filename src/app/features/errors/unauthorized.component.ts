import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="center">
      <h2>403 — Not authorized</h2>
      <p>Your account does not have access to this page (ADMIN only).</p>
      <a routerLink="/dashboard">Back to dashboard</a>
    </div>
  `,
  styles: [`.center { text-align: center; padding: 48px 16px; }`]
})
export class UnauthorizedComponent {}
