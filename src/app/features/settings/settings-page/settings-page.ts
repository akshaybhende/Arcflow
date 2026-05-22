import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

export type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'team' | 'about';

export interface SettingsNavItem {
  id: SettingsTab;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly navItems: SettingsNavItem[] = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'team', label: 'Team', icon: 'groups' },
    { id: 'about', label: 'About', icon: 'info' },
  ];

  activeTab: SettingsTab = 'profile';

  selectTab(tab: SettingsTab): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }
}
