import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import { LeftComponent } from './components/left/left.component';
import { RightComponent } from './components/right/right.component';
import { AllComponent } from './components/all/all.component';
import { AddNewComponent } from './components/add-new/add-new.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { ReactiveFormsModule } from '@angular/forms';// import { UserDetailsComponent } from './user-details/user-details.component';
import { UserService } from './services/user.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserListItemComponent,
    LeftComponent,
    RightComponent,
    AllComponent,
    
    AddNewComponent,
    UserDetailsComponent,
    AddNewUserComponent,
    NavbarComponent,
  

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
