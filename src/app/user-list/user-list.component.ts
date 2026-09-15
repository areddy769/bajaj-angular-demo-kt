import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  filteredUsers: User[] = [];

  loading = false;
  errorMessage = '';

  searchText = '';
  sortAscending = true;

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}
  

  ngOnInit(): void {
    this.loadUsers();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },

      error: (error) => {
        console.error(error);
        this.errorMessage = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  searchUsers(): void {
    const search = this.searchText.toLowerCase();

    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.city.toLowerCase().includes(search)
    );
  }

  sortByFirstName(): void {
    this.filteredUsers.sort((a, b) => {
      const nameA = a.firstName.toLowerCase();
      const nameB = b.firstName.toLowerCase();

      if (nameA < nameB) {
        return this.sortAscending ? -1 : 1;
      }

      if (nameA > nameB) {
        return this.sortAscending ? 1 : -1;
      }

      return 0;
    });

    this.sortAscending = !this.sortAscending;
  }
  deleteUser(id: number): void {

  const confirmed = confirm('Are you sure you want to delete this user?');

  if (!confirmed) {
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.userService.deleteUser(id).pipe(takeUntil(this.destroy$)).subscribe({
    next: () => {

      this.users = this.users.filter(user => user.id !== id);

      this.filteredUsers = this.filteredUsers.filter(
        user => user.id !== id
      );

      this.loading = false;
    },

    error: (error) => {

      console.error(error);

      this.errorMessage = 'Failed to delete user.';
      this.loading = false;
    }
  });
}
}