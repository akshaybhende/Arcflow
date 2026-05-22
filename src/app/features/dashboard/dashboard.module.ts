import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Dashboard } from './dashboard/dashboard';

Chart.register(...registerables);

@NgModule({
  declarations: [Dashboard],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DashboardRoutingModule,
    MatIconModule,
    MatTableModule,
    BaseChartDirective,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class DashboardModule {}
