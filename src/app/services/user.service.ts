import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [

    {
      
      id: 1,
      firstName: 'Purva',
      lastName: 'Saoji',
      dob: '1998-05-12',
      city: 'Pune',
      mobile: '9876543210',
      email: 'purva@gmail.com'
    },

    {
      id: 2,
      firstName: 'Shiv',
      lastName: 'Pawar',
      dob: '1995-08-20',
      city: 'Mumbai',
      mobile: '8625942756',
      email: 'shiv@gmail.com'
    },

    {
      id: 3,
      firstName: 'Pooja',
      lastName: 'Patil',
      dob: '2000-01-15',
      city: 'Nagpur',
      mobile: '9988776655',
      email: 'pooja@gmail.com'
    }

  ];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  saveUser(user: User): void {

    if (user.id) {

      const index = this.users.findIndex(u => u.id === user.id);

      if (index !== -1) {
        this.users[index] = { ...user };
      }

    } else {

      user.id = Date.now();
      this.users.push(user);

    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
  }
}