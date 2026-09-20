import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './compo/loading.component';
import { ErrorNotificationComponent } from './compo/error.component';
import { NotificationsComponent } from './compo/notifications.component';

// Import SharedModule in every feature module: form + common + reusable UI in one place.
@NgModule({
  declarations: [
    LoadingComponent,
    NotificationsComponent,
    ErrorNotificationComponent
    
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    NotificationsComponent,
    ErrorNotificationComponent
   
  ]
})
export class SharedModule {}