import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

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
  private readonly authService = inject(AuthService);

  private readonly allNavItems: SettingsNavItem[] = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'team', label: 'Team', icon: 'groups' },
    { id: 'about', label: 'About', icon: 'info' },
  ];

  get navItems(): SettingsNavItem[] {
    if (this.authService.currentUser?.role === 'sales-rep') {
      return this.allNavItems.filter((item) => item.id !== 'team');
    }
    return this.allNavItems;
  }

  activeTab: SettingsTab = 'profile';

  selectTab(tab: SettingsTab): void {
    if (!this.navItems.some((item) => item.id === tab)) {
      return;
    }
    this.activeTab = tab;
    this.cdr.markForCheck();
  }
}
