import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedModule } from '../../shared/shared.module';
import { ActivitiesDialogModule } from '../activities/activities-dialog.module';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsList } from './contacts-list/contacts-list';
import { ContactDetail } from './contact-detail/contact-detail';
import { ContactForm } from './contact-form/contact-form';

@NgModule({
  declarations: [ContactsList, ContactDetail, ContactForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ActivitiesDialogModule,
    ContactsRoutingModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class ContactsModule {}
