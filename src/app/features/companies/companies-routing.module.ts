import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesList } from './companies-list/companies-list';
import { CompanyDetail } from './company-detail/company-detail';
import { CompanyForm } from './company-form/company-form';

const routes: Routes = [
  { path: '', component: CompaniesList },
  { path: 'new', component: CompanyForm },
  { path: ':id', component: CompanyDetail },
  { path: ':id/edit', component: CompanyForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
