import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';


const routes: Routes = [
 
  

  {
    path:'',
    loadComponent: () =>
      import('./layout/layout.component')
        .then(c => c.LayoutComponent),
    children:[

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },


       
    { path: 'customers', loadChildren: () => import('./features/customer/customer.module').then(m => m.CustomerModule) },
 
  // { path: 'customers', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
 
     { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
 
     { path: 'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },
 

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
