import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayout } from './layout/main-layout/main-layout';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('./features/contacts/contacts.module').then((m) => m.ContactsModule),
      },
      {
        path: 'deals',
        loadChildren: () => import('./features/deals/deals.module').then((m) => m.DealsModule),
      },
      {
        path: 'companies',
        loadChildren: () =>
          import('./features/companies/companies.module').then((m) => m.CompaniesModule),
      },
      {
        path: 'activities',
        loadChildren: () =>
          import('./features/activities/activities.module').then((m) => m.ActivitiesModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.module').then((m) => m.SettingsModule),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
