import { Routes } from '@angular/router';
import { UserFormComponent } from './features/user-form/user-form.component';
import { UserListComponent } from './features/user-list/user-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'user-form', component: UserFormComponent },
  { path: 'user-form/:id', component: UserFormComponent }
];