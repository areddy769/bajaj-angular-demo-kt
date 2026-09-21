import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './user.component';
import { UserFormComponent } from './userform/userform.component';

const routes: Routes = [
  { path: '', component: ManageComponent },

  {
  path: 'edit',
  component: UserFormComponent
},
{
  path: 'edit/:id',
  component: UserFormComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
