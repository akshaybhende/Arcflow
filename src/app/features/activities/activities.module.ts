import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatAutocompleteModule,
  ],
})
export class ActivitiesModule {}
