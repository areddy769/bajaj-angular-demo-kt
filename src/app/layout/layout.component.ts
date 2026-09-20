import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { SessionUser } from '../models/models';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {



  user$: Observable<SessionUser | null>;

  constructor(private auth: AuthService, private router : Router) {
    this.user$ = this.auth.currUser$;
  }
  
}