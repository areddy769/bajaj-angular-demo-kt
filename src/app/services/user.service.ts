import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[] = [
    {
      id: 1,
      firstName: 'Aarav',
      lastName: 'Sharma',
      email: 'aarav.sharma@example.com',
      mobile: '919876543210',
      city: 'Pune',
      password: 'Aarav@2026X!'
    },
    {
      id: 2,
      firstName: 'Priya',
      lastName: 'Patil',
      email: 'priya.patil@example.com',
      mobile: '919876543211',
      city: 'Mumbai',
      password: 'Priya@2026X!'
    },
    {
      id: 3,
      firstName: 'Rahul',
      lastName: 'Verma',
      email: 'rahul.verma@example.com',
      mobile: '919876543212',
      city: 'Delhi',
      password: 'Rahul@2026X!'
    },
    {
      id: 4,
      firstName: 'Sneha',
      lastName: 'Joshi',
      email: 'sneha.joshi@example.com',
      mobile: '919876543213',
      city: 'Bangalore',
      password: 'Sneha@2026X!'
    },
    {
      id: 5,
      firstName: 'Vikram',
      lastName: 'Deshmukh',
      email: 'vikram.deshmukh@example.com',
      mobile: '919876543214',
      city: 'Nagpur',
      password: 'Vikram@2026X!'
    },
    {
      id: 6,
      firstName: 'Ananya',
      lastName: 'Kulkarni',
      email: 'ananya.kulkarni@example.com',
      mobile: '919876543215',
      city: 'Nashik',
      password: 'Ananya@2026X!'
    },
    {
      id: 7,
      firstName: 'Rohan',
      lastName: 'Mehta',
      email: 'rohan.mehta@example.com',
      mobile: '919876543216',
      city: 'Ahmedabad',
      password: 'Rohan@2026X!'
    },
    {
      id: 8,
      firstName: 'Kavya',
      lastName: 'Reddy',
      email: 'kavya.reddy@example.com',
      mobile: '919876543217',
      city: 'Hyderabad',
      password: 'Kavya@2026X!'
    }
    
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);

  users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private http : HttpClient ) {}


  getUsers(): Observable<User[]> {
    return this.users$;
  }

  
  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  
  addUser(user: User): void {
    const newId = this.users.length > 0
      ? Math.max(...this.users.map(u => u.id)) + 1
      : 1;

    const newUser: User = {
      ...user,
      id: newId
    };

    this.users.push(newUser);

    this.usersSubject.next([...this.users]);
  }

  
  
  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);

    this.usersSubject.next([...this.users]);
  }











  
  
  // updateUser(user: User): void {
  //   const index = this.users.findIndex(u => u.id === user.id);

  //   if (index !== -1) {
  //     this.users[index] = {
  //       ...user
  //     };

  //     this.usersSubject.next([...this.users]);
  //   }
  // }
}