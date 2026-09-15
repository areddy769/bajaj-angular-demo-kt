import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
export class UserListItemComponent {

  @Input() user: any;
  

  

  viewUser(){
    console.log(this.user.id)
  }

  

 
}