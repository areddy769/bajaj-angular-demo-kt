import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

const routes: Routes = [

  // Default route
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // Public login
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.module')
        .then(m => m.AuthModule)
  },

  // Protected application area
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      // Dashboard
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },

      // Customers   here i have used lazy loading for the customers module, 
      {
        path: 'customers',
        loadChildren: () =>
          import('./features/customers/customers.module')
            .then(m => m.CustomersModule)
      },

      // Users - ADMIN only
      {
        path: 'users/add',
        canActivate: [RoleGuard],
        component: UserFormComponent
      },

      {
        path: 'users/edit/:id',
        canActivate: [RoleGuard],
        component: UserFormComponent
      },

      {
        path: 'users',
        canActivate: [RoleGuard],
        component: UserListComponent
      }
    ]
  },

  // Unauthorized page
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },

  // Unknown route
  {
    path: '**',
    redirectTo: 'dashboard'
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