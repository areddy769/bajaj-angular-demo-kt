import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './customer/customer-form/customer-form.component';
import { EmployeesComponent } from './employees/employees.component';

import { AuthInterceptor } from './core/services/auth/auth.interceptor';

@NgModule({
declarations: [
AppComponent,
LoginComponent,
DashboardComponent,
CustomerComponent,
CustomerListComponent,
EmployeesComponent,
CustomerFormComponent
],

imports: [
BrowserModule,
FormsModule,
ReactiveFormsModule,
HttpClientModule,
AppRoutingModule
],

providers: [
{
provide: HTTP_INTERCEPTORS,
useClass: AuthInterceptor,
multi: true
}
],

bootstrap: [AppComponent]
})
export class AppModule {}
