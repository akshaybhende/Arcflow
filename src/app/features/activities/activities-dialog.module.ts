import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { LogActivityDialog } from './log-activity-dialog/log-activity-dialog';

@NgModule({
  declarations: [LogActivityDialog],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  exports: [LogActivityDialog],
})
export class ActivitiesDialogModule {}
