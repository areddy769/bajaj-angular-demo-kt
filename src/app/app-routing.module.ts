import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { CustomerComponent } from './customer/customer.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './customer/customer-form/customer-form.component';

import { EmployeesComponent } from './employees/employees.component';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'customers',
    component: CustomerComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'customers/list',
    component: CustomerListComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'customers/add',
    component: CustomerFormComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'customers/edit/:id',
    component: CustomerFormComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'users',
    component: EmployeesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}