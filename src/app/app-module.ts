import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { InMemoryDataService } from './mock/in-memory-data.service';
import { reducers } from './store/app.state';
import { ActivitiesEffects } from './store/activities/activities.effects';
import { CompaniesEffects } from './store/companies/companies.effects';
import { ContactsEffects } from './store/contacts/contacts.effects';
import { DealsEffects } from './store/deals/deals.effects';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    AppRoutingModule,
    LayoutModule,
    CoreModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      ContactsEffects,
      DealsEffects,
      CompaniesEffects,
      ActivitiesEffects,
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      delay: 300,
      passThruUnknownUrl: true,
    }),
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [App],
})
export class AppModule {}
