import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { UnauthorizedComponent } from './features/errors/unauthorized.component';
import { NotFoundComponent } from './features/errors/not-found.component';

// Feature modules load only when their route is visited (check Network tab).
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customers',
    loadChildren: () => import('./features/customers/customers.module').then((m) => m.CustomersModule),
    canActivate: [AuthGuard]
  },
  {
    // Authentication (logged in) AND authorization (ADMIN role) are checked.
    path: 'users',
    loadChildren: () => import('./features/users/users.module').then((m) => m.UsersModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
