import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionUser } from '../../models/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() user$!: Observable<SessionUser | null> ;
}