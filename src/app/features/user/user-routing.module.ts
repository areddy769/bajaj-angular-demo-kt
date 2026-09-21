import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './user.component';
import { UserFormComponent } from './userform/userform.component';
import { AdminGuard } from 'src/app/core/guards/admin.guard';
import { unsavedChangesGuard } from 'src/app/core/guards/unsaved.guard';

const routes: Routes = [
  { path: '', component: ManageComponent, 
    canActivate:[AdminGuard]
  },

  {
  path: 'edit',
  component: UserFormComponent,
  canActivate:[AdminGuard],
  // canDeactivate:[unsavedChangesGuard]
},
{
  path: 'edit/:id',
  component: UserFormComponent,
  canActivate:[AdminGuard],
  // canDeactivate:[unsavedChangesGuard]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
