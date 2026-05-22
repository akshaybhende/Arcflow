import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

import { SharedModule } from '../../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings-page/settings-page';
import { SettingsProfile } from './settings-profile/settings-profile';
import { SettingsAppearance } from './settings-appearance/settings-appearance';
import { SettingsNotifications } from './settings-notifications/settings-notifications';
import { SettingsTeam } from './settings-team/settings-team';
import { SettingsAbout } from './settings-about/settings-about';

@NgModule({
  declarations: [
    SettingsPage,
    SettingsProfile,
    SettingsAppearance,
    SettingsNotifications,
    SettingsTeam,
    SettingsAbout,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    SettingsRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
  ],
})
export class SettingsModule {}
