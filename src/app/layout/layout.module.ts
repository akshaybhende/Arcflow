import { LayoutModule as CdkLayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SharedModule } from '../shared/shared.module';
import { MainLayout } from './main-layout/main-layout';
import { Sidebar } from './sidebar/sidebar';
import { Topbar } from './topbar/topbar';
import { LayoutPlaceholder } from './layout-placeholder/layout-placeholder';

@NgModule({
  declarations: [MainLayout, Sidebar, Topbar, LayoutPlaceholder],
  imports: [
    CdkLayoutModule,
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatDividerModule,
    MatSidenavModule,
  ],
  exports: [MainLayout, Sidebar, Topbar],
})
export class LayoutModule {}
