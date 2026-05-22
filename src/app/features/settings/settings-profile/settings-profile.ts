import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.html',
  styleUrl: './settings-profile.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsProfile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  avatarPreview: string | null = null;

  readonly form = this.fb.group({
    name: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    department: this.fb.control(''),
  });

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.form.patchValue({
        name: user.name,
        email: user.email,
        department: user.department ?? '',
      });
      this.avatarPreview = user.avatar ?? null;
    }
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.authService.updateProfile({
      name: raw.name.trim(),
      email: raw.email.trim(),
      department: raw.department?.trim() || undefined,
      avatar: this.avatarPreview ?? undefined,
    });
    this.notificationService.success('Profile saved');
  }
}
