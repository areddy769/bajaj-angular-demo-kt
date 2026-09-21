import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ManageComponent } from './user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './userform/userform.component';


@NgModule({
  declarations: [
    ManageComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
  
  ]
})
export class UserModule { }
