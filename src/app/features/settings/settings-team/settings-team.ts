import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MOCK_USERS } from '../../../mock/mock-data';
import { UserRole } from '../../../core/models';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-settings-team',
  templateUrl: './settings-team.html',
  styleUrl: './settings-team.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTeam {
  private readonly notificationService = inject(NotificationService);

  readonly members = MOCK_USERS;

  roleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      admin: 'Admin',
      manager: 'Manager',
      'sales-rep': 'Sales Rep',
    };
    return labels[role];
  }

  onInvite(): void {
    this.notificationService.info('Coming soon');
  }
}
