import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { User } from '../models/user';

interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    city: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<ApiUser[]>(this.apiUrl).pipe(
      map((users: ApiUser[]) =>
        users.map((user: ApiUser) => {
          const nameParts = user.name.split(' ');

          return {
            id: user.id,
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(' '),
            email: user.email,
            mobile: user.phone,
            city: user.address.city
          };
        })
      )
    );
  }

  getUser(id: number): Observable<User> {
  return this.http.get<ApiUser>(`${this.apiUrl}/${id}`).pipe(
    map((user: ApiUser) => {
      const nameParts = user.name.split(' ');

      return {
        id: user.id,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        email: user.email,
        mobile: user.phone,
        city: user.address.city
      };
    })
  );
}

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}