import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiSuccess, LoginResponse, SessionUser, UserRole } from 'src/app/models/models';
import { backend } from '../api';




const USER='jdnsl'
const TOKEN='fnkdmk'

@Injectable({
  providedIn: 'root'
})





export class AuthService {

  private readonly currSub: BehaviorSubject<SessionUser|null>


  readonly currUser$ : Observable<SessionUser|null>

  constructor( private http :  HttpClient) {

    this.currSub =new BehaviorSubject<SessionUser|null>(this.storedUser());
    this.currUser$=this.currSub.asObservable();

    

  }




  login(email:string,password:string):Observable<ApiSuccess<LoginResponse>>{
    return this.http.post<ApiSuccess<LoginResponse>>(`${backend.apiUrl}/auth/login`, { email, password }).pipe(

      tap(res=>{

         localStorage.setItem(TOKEN, res.data.token);
          localStorage.setItem(USER, JSON.stringify(res.data.user));
          this.currSub.next(res.data.user);
      })
    )
  }

  logout():void{
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    this.currSub.next(null);
  }

  
  getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }

  isLogin():boolean{
    return !!this.getToken() && !!this.currSub.value
  }


  hasRole(role : UserRole):boolean{
    return this.currSub.value?.role===role;
  }

  get currUser():SessionUser|null{
    return this.currSub.value;
  }















  private storedUser():SessionUser | null{

    

     try {
      const raw = localStorage.getItem(USER);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  

  }
}
