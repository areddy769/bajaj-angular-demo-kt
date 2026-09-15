import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { FullNamePipe } from './pipes/full-name.pipe';

// Import SharedModule in every feature module: form + common + reusable UI in one place.
@NgModule({
  declarations: [
    LoaderComponent,
    EmptyStateComponent,
    ErrorMessageComponent,
    StatusBadgeComponent,
    PaginationComponent,
    ConfirmDialogComponent,
    NotificationsComponent,
    FullNamePipe
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    EmptyStateComponent,
    ErrorMessageComponent,
    StatusBadgeComponent,
    PaginationComponent,
    ConfirmDialogComponent,
    NotificationsComponent,
    FullNamePipe
  ]
})
export class SharedModule {}
