import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealDetail } from './deal-detail/deal-detail';
import { DealForm } from './deal-form/deal-form';
import { DealsPage } from './deals';

const routes: Routes = [
  { path: '', component: DealsPage },
  { path: 'new', component: DealForm },
  { path: ':id', component: DealDetail },
  { path: ':id/edit', component: DealForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealsRoutingModule {}
