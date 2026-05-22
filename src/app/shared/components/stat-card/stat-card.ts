import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type StatCardTrendDirection = 'up' | 'down' | 'neutral';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) icon!: string;
  @Input() iconColor = '#2563eb';
  @Input() iconBg = '#eff6ff';
  @Input() trend?: string;
  @Input() trendPeriod = 'vs last month';
  @Input() trendDirection: StatCardTrendDirection = 'neutral';
}
