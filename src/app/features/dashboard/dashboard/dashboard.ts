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

function resolveCssVar(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function resolvedStageColors(): Record<DealStage, string> {
  return {
    lead: resolveCssVar('--color-stage-lead') || '#8b5cf6',
    qualified: resolveCssVar('--color-stage-qualified') || '#3b82f6',
    proposal: resolveCssVar('--color-stage-proposal') || '#f59e0b',
    negotiation: resolveCssVar('--color-stage-negotiation') || '#f97316',
    won: resolveCssVar('--color-stage-won') || '#16a34a',
    lost: resolveCssVar('--color-stage-lost') || '#dc2626',
  };
}

const STAGE_COLORS: Record<DealStage, string> = {
  lead: '#8b5cf6',
  qualified: '#3b82f6',
  proposal: '#f59e0b',
  negotiation: '#f97316',
  won: '#16a34a',
  lost: '#dc2626',
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
    map((summary): ChartData<'doughnut'> => {
      const colors = resolvedStageColors();
      return {
        labels: summary.map((s) => STAGE_LABELS[s.stage]),
        datasets: [
          {
            data: summary.map((s) => s.count),
            backgroundColor: summary.map((s) => colors[s.stage]),
            borderWidth: 2,
            borderColor: resolveCssVar('--color-bg-surface') || '#1e293b',
            hoverOffset: 6,
          },
        ],
      };
    }),
  );

  readonly lineData$ = this.store.select(selectMonthlyWonRevenue).pipe(
    map((months): ChartData<'line'> => {
      const primary = resolveCssVar('--color-primary') || '#2563eb';
      return {
        labels: months.map((m) => m.label),
        datasets: [
          {
            data: months.map((m) => m.value),
            label: 'Revenue',
            borderColor: primary,
            backgroundColor: primary + '33',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
        ],
      };
    }),
  );

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {};
  lineOptions: ChartConfiguration<'line'>['options'] = {};

  private buildChartOptions(): void {
    const tickColor = resolveCssVar('--color-text-tertiary') || '#64748b';
    const gridColor = resolveCssVar('--color-border') || '#334155';

    this.doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      cutout: '65%',
    };

    this.lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: resolveCssVar('--color-bg-surface') || '#1e293b',
          titleColor: resolveCssVar('--color-text-primary') || '#f1f5f9',
          bodyColor: resolveCssVar('--color-text-secondary') || '#94a3b8',
          borderColor: gridColor,
          borderWidth: 1,
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
          ticks: { color: tickColor },
          border: { color: gridColor },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: tickColor,
            callback: (value) => {
              const n = Number(value);
              if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
              if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
              return `$${n.toFixed(0)}`;
            },
          },
          grid: { color: gridColor },
          border: { color: gridColor },
        },
      },
    };
  }

  ngOnInit(): void {
    this.buildChartOptions();
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
