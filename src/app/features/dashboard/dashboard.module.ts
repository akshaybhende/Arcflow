import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

import { SharedModule } from '../../shared/shared.module';
import { ActivitiesDialogModule } from '../activities/activities-dialog.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Dashboard } from './dashboard/dashboard';

Chart.register(...registerables);

@NgModule({
  declarations: [Dashboard],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ActivitiesDialogModule,
    DashboardRoutingModule,
    BaseChartDirective,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class DashboardModule {}
