import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
      canActivate:[AuthGuard]
      ,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'customers',
        loadChildren: () =>
          import('./features/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
      },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },

      {
        path: 'user',
        loadChildren: () =>
          import('./features/user/user.module').then(
            (m) => m.UserModule
          ),
          canActivate:[AdminGuard],
      },
    ],
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(
        (m) => m.AuthModule
      ),
  },

  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}