import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

const NOTIFICATIONS_KEY = 'arcflow-notification-prefs';

export interface NotificationPrefs {
  email: boolean;
  inApp: boolean;
  dealReminders: boolean;
  activityReminders: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  email: true,
  inApp: true,
  dealReminders: true,
  activityReminders: true,
};

@Component({
  selector: 'app-settings-notifications',
  templateUrl: './settings-notifications.html',
  styleUrl: './settings-notifications.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsNotifications implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly form = this.fb.group({
    email: this.fb.nonNullable.control(true),
    inApp: this.fb.nonNullable.control(true),
    dealReminders: this.fb.nonNullable.control(true),
    activityReminders: this.fb.nonNullable.control(true),
  });

  ngOnInit(): void {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (raw) {
      try {
        const prefs = JSON.parse(raw) as NotificationPrefs;
        this.form.patchValue({ ...DEFAULT_PREFS, ...prefs });
      } catch {
        /* use defaults */
      }
    }
  }

  onSave(): void {
    const prefs = this.form.getRawValue() as NotificationPrefs;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(prefs));
    this.notificationService.success('Notification preferences saved');
    this.cdr.markForCheck();
  }
}
