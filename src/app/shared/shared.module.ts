import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PageHeader } from './components/page-header/page-header';
import { StatCard } from './components/stat-card/stat-card';
import { EmptyState } from './components/empty-state/empty-state';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { Avatar } from './components/avatar/avatar';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { HasRoleDirective } from './directives/has-role.directive';
import { InitialsPipe } from './pipes/initials.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';

const SHARED_DECLARATIONS = [
  PageHeader,
  StatCard,
  EmptyState,
  ConfirmDialog,
  Avatar,
  LoadingSpinner,
  ClickOutsideDirective,
  HasRoleDirective,
  InitialsPipe,
  TimeAgoPipe,
  CurrencyFormatPipe,
];

@NgModule({
  declarations: SHARED_DECLARATIONS,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [...SHARED_DECLARATIONS, MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule],
})
export class SharedModule {}
