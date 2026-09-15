import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user!:User|undefined

  constructor(
    private route: ActivatedRoute,
    private userservice: UserService,
    private router:Router
  ) {}

  
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');

    this.user = this.userservice.getUserById(Number(id));

   
  });
}

 deleteUser(): void {
    if (this.user) {
      this.userservice.deleteUser(this.user.id);

    

       this.router.navigate(['../']);
    }
  }



  
 
}