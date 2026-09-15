import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getUsers();
    this.filteredUsers = [...this.users];
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(u =>
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.city && u.city.toLowerCase().includes(term))
    );
  }

  onAddUser(): void {
    this.router.navigate(['/users/add']);
  }

  onEditUser(id?: number): void {
    if (id) {
      this.router.navigate(['/users/edit', id]);
    }
  }

  onDeleteUser(id?: number): void {
    if (id && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id);
      this.loadUsers();
      this.onSearch();
    }
  }
}