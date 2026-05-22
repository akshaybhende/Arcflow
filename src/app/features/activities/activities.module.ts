import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '../../shared/shared.module';
import { ActivitiesDialogModule } from './activities-dialog.module';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivitiesList } from './activities-list/activities-list';

@NgModule({
  declarations: [ActivitiesList],
  imports: [
    CommonModule,
    ScrollingModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    ActivitiesRoutingModule,
    ActivitiesDialogModule,
    MatDialogModule,
  ],
})
export class ActivitiesModule {}
