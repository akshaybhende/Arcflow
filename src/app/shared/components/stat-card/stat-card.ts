import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

export type StatCardTrendDirection = 'up' | 'down' | 'neutral';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) icon!: string;
  @Input() iconColor = 'var(--color-primary)';
  @Input() trend?: string;
  @Input() trendDirection: StatCardTrendDirection = 'neutral';

  @HostBinding('style.--icon-color')
  get iconColorVar(): string {
    return this.iconColor;
  }
}
