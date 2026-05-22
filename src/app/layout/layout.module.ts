import { LayoutModule as CdkLayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  ],
  exports: [MainLayout, Sidebar, Topbar],
})
export class LayoutModule {}
