import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AllComponent } from './components/all/all.component';
import { AddNewComponent } from './components/add-new/add-new.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';

const routes: Routes = [
  {
    path:'',
    component:AllComponent,
    children:[
      {
        path:'',
        component:AddNewComponent
      },
      {
        path:'add',
        component:AddNewUserComponent
      },
      {
        path:':id',
         component:UserDetailsComponent
      },

    ]

  },
  {
    path:'**',
    redirectTo:''
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
