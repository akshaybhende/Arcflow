import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { SharedModule } from '../../shared/shared.module';
import { DealDetail } from './deal-detail/deal-detail';
import { DealForm } from './deal-form/deal-form';
import { DealsPage } from './deals';
import { DealsRoutingModule } from './deals-routing.module';

@NgModule({
  declarations: [DealsPage, DealDetail, DealForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DealsRoutingModule,
    DragDropModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class DealsModule {}
