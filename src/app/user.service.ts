import { Injectable } from '@angular/core';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      firstName: 'Priya',
      lastName: 'Sharma',
      dob: '1995-08-15',
      city: 'Pune',
      mobile: '9876543210',
      email: 'priya@gmail.com'
    },
    {
      id: 2,
      firstName: 'Rahul',
      lastName: 'Verma',
      dob: '1992-03-22',
      city: 'Mumbai',
      mobile: '9123456789',
      email: 'rahul@gmail.com'
    }
  ];


  getUsers(): User[] {
    return [...this.users];
  }


  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }


  addUser(user: Omit<User, 'id'>): void {
    const newId = this.users.length ? Math.max(...this.users.map(u => u.id || 0)) + 1 : 1;
    this.users.push({ id: newId, ...user });
  }


  updateUser(updatedUser: User): void {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = { ...updatedUser };
    }
  }

 
  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
  }
}