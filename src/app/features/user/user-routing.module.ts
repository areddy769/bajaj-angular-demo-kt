import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './user.component';
import { UserFormComponent } from './userform/userform.component';
import { AdminGuard } from 'src/app/core/guards/admin.guard';

const routes: Routes = [
  { path: '', component: ManageComponent, 
    canActivate:[AdminGuard]
  },

  {
  path: 'edit',
  component: UserFormComponent,
  canActivate:[AdminGuard]
},
{
  path: 'edit/:id',
  component: UserFormComponent,
  canActivate:[AdminGuard]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
