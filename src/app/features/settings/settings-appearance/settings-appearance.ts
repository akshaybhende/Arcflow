import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  ACCENT_COLOR_OPTIONS,
  AccentColorId,
  ThemePreference,
  ThemeService,
} from '../../../core/services/theme.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-settings-appearance',
  templateUrl: './settings-appearance.html',
  styleUrl: './settings-appearance.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAppearance implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly accentOptions = ACCENT_COLOR_OPTIONS;
  readonly themeOptions: { value: ThemePreference; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'system', label: 'System', icon: 'brightness_auto' },
  ];

  themePreference: ThemePreference = 'system';
  accentColor: AccentColorId = 'blue';

  ngOnInit(): void {
    this.themePreference = this.themeService.currentThemePreference;
    this.accentColor = this.themeService.currentAccent;
  }

  selectTheme(preference: ThemePreference): void {
    this.themePreference = preference;
    this.themeService.setThemePreference(preference);
    this.cdr.markForCheck();
  }

  selectAccent(accent: AccentColorId): void {
    this.accentColor = accent;
    this.themeService.setAccentColor(accent);
    this.cdr.markForCheck();
  }

  onSave(): void {
    this.themeService.setThemePreference(this.themePreference);
    this.themeService.setAccentColor(this.accentColor);
    this.notificationService.success('Appearance preferences saved');
  }
}
