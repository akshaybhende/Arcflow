import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

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
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class ContactsModule {}
