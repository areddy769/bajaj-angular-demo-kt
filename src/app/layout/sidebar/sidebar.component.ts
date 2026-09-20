import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../models/models';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // @Input() role: UserRole | null = null;

  constructor(public  auth:AuthService,
    public router:Router
  ){

  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/auth'])

  }

  


}