import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { SharedModule } from '../../shared/shared.module';
import { CompaniesList } from './companies-list/companies-list';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompanyDetail } from './company-detail/company-detail';
import { CompanyForm } from './company-form/company-form';

@NgModule({
  declarations: [CompaniesList, CompanyDetail, CompanyForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    CompaniesRoutingModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class CompaniesModule {}
