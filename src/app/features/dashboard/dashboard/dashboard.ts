import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartConfiguration, ChartData } from 'chart.js';
import { map } from 'rxjs/operators';
import { DealStage } from '../../../core/models';
import { loadActivities } from '../../../store/activities/activities.actions';
import {
  selectActivitiesDueToday,
  selectOverdueActivitiesCount,
  selectRecentActivities,
} from '../../../store/activities/activities.selectors';
import { loadContacts } from '../../../store/contacts/contacts.actions';
import { selectContactsTotal } from '../../../store/contacts/contacts.selectors';
import { loadDeals } from '../../../store/deals/deals.actions';
import {
  selectDealsByStageSummary,
  selectMonthlyWonRevenue,
  selectOpenDealsCount,
  selectTopOpenDeals,
  selectWonRevenueSum,
} from '../../../store/deals/deals.selectors';

const STAGE_COLORS: Record<DealStage, string> = {
  lead: 'var(--color-stage-lead)',
  qualified: 'var(--color-stage-qualified)',
  proposal: 'var(--color-stage-proposal)',
  negotiation: 'var(--color-stage-negotiation)',
  won: 'var(--color-stage-won)',
  lost: 'var(--color-stage-lost)',
};

const STAGE_LABELS: Record<DealStage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

const ACTIVITY_ICONS: Record<string, string> = {
  call: 'phone',
  email: 'mail',
  meeting: 'groups',
  task: 'task_alt',
  note: 'sticky_note_2',
  'deal-update': 'trending_up',
  'contact-created': 'person_add',
};

const ACTIVITY_COLORS: Record<string, string> = {
  call: 'var(--color-info)',
  email: 'var(--color-primary)',
  meeting: 'var(--color-stage-qualified)',
  task: 'var(--color-warning)',
  note: 'var(--color-text-tertiary)',
  'deal-update': 'var(--color-stage-won)',
  'contact-created': 'var(--color-stage-lead)',
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly store = inject(Store);

  readonly contactsTotal$ = this.store.select(selectContactsTotal);
  readonly openDealsCount$ = this.store.select(selectOpenDealsCount);
  readonly wonRevenueSum$ = this.store.select(selectWonRevenueSum);
  readonly activitiesDueToday$ = this.store.select(selectActivitiesDueToday);
  readonly overdueCount$ = this.store.select(selectOverdueActivitiesCount);
  readonly recentActivities$ = this.store.select(selectRecentActivities);
  readonly topOpenDeals$ = this.store.select(selectTopOpenDeals);
  readonly stageSummary$ = this.store.select(selectDealsByStageSummary);

  readonly doughnutData$ = this.stageSummary$.pipe(
    map(
      (summary): ChartData<'doughnut'> => ({
        labels: summary.map((s) => STAGE_LABELS[s.stage]),
        datasets: [
          {
            data: summary.map((s) => s.count),
            backgroundColor: summary.map((s) => STAGE_COLORS[s.stage]),
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      }),
    ),
  );

  readonly lineData$ = this.store.select(selectMonthlyWonRevenue).pipe(
    map(
      (months): ChartData<'line'> => ({
        labels: months.map((m) => m.label),
        datasets: [
          {
            data: months.map((m) => m.value),
            label: 'Revenue',
            borderColor: 'var(--color-primary)',
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      }),
    ),
  );

  readonly doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    cutout: '62%',
  };

  readonly lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y ?? 0;
            return ` $${value.toLocaleString('en-US')}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'var(--color-text-tertiary)' },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: 'var(--color-text-tertiary)',
          callback: (value) => `$${Number(value) / 1000}k`,
        },
        grid: { color: 'var(--color-border)' },
      },
    },
  };

  ngOnInit(): void {
    this.store.dispatch(loadContacts());
    this.store.dispatch(loadDeals());
    this.store.dispatch(loadActivities());
  }

  stageLabel(stage: DealStage): string {
    return STAGE_LABELS[stage];
  }

  stageColor(stage: DealStage): string {
    return STAGE_COLORS[stage];
  }

  activityIcon(type: string): string {
    return ACTIVITY_ICONS[type] ?? 'event';
  }

  activityColor(type: string): string {
    return ACTIVITY_COLORS[type] ?? 'var(--color-text-tertiary)';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
