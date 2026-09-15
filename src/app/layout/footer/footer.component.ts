import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<footer class="foot">Customer Portal — training application · API :3000 · App :4200</footer>`,
  styles: [`
    .foot { text-align: center; padding: 12px; background: transparent;
      border-top: 1px solid var(--line); color: var(--ink-2); font-size: 12px; }
  `]
})
export class FooterComponent {}
