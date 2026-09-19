import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionUser } from '../../models/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() user: SessionUser | null = null;
}