import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../models/models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() role: UserRole | null = null;
}