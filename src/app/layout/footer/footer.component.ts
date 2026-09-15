import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `<footer class="foot">Bajaj Angular Fresher Demo — training application</footer>`,
  styles: [`
    .foot { text-align: center; padding: 10px; background: #eceff1; color: #546e7a; font-size: 12px; }
  `]
})
export class FooterComponent {}
