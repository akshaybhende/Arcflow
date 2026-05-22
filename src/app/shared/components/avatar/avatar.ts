import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

const AVATAR_COLORS = [
  'var(--color-brand-500)',
  'var(--color-brand-600)',
  'var(--color-brand-700)',
  'var(--color-stage-qualified)',
  'var(--color-stage-lead)',
  'var(--color-info)',
];

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() src?: string;
  @Input() name?: string;
  @Input() size: AvatarSize = 'md';
  @Input() shape: AvatarShape = 'circle';

  imageError = false;

  get showImage(): boolean {
    return !!this.src && !this.imageError;
  }

  get backgroundColor(): string {
    const seed = this.name?.trim() || '?';
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  onImageError(): void {
    this.imageError = true;
    this.cdr.markForCheck();
  }
}
