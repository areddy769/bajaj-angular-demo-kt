import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getUsers();
  }

  editUser(id?: number): void {
    if (id) this.router.navigate(['/user-form', id]);
  }

  deleteUser(id?: number): void {
    if (id) {
      this.userService.deleteUser(id);
      this.loadUsers();
    }
  }
}