import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ChartConfiguration, ChartData, Plugin } from 'chart.js';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { DealStage } from '../../../core/models';
import { loadActivities } from '../../../store/activities/activities.actions';
import { selectRecentActivities } from '../../../store/activities/activities.selectors';
import {
  selectDashboardKpis,
  selectMonthlyPipelineValue,
} from '../../../store/dashboard/dashboard-kpi.selectors';
import { loadContacts } from '../../../store/contacts/contacts.actions';
import { loadDeals } from '../../../store/deals/deals.actions';
import { selectDealsByStageSummary, selectTopOpenDeals } from '../../../store/deals/deals.selectors';
import { LogActivityDialog } from '../../activities/log-activity-dialog/log-activity-dialog';

const ACTIVE_STAGES: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation'];

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
  proposal: '#22c55e',
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
  call: '#16a34a',
  email: '#2563eb',
  meeting: '#3b82f6',
  task: '#d97706',
  note: '#64748b',
  'deal-update': '#16a34a',
  'contact-created': '#8b5cf6',
};

const ACTIVITY_ICON_BG: Record<string, string> = {
  call: '#f0fdf4',
  email: '#eff6ff',
  meeting: '#eff6ff',
  task: '#fffbeb',
  note: '#f1f5f9',
  'deal-update': '#f0fdf4',
  'contact-created': '#f5f3ff',
};

const DOUGHNUT_CENTER_TEXT_PLUGIN: Plugin<'doughnut'> = {
  id: 'dashboardDoughnutCenterText',
  afterDraw: (chart) => {
    const meta = chart.getDatasetMeta(0);
    const first = meta?.data?.[0];
    if (!first || !('startAngle' in first)) {
      return;
    }

    const x = first.x;
    const y = first.y;
    const total = (chart.data.datasets[0]?.data ?? []).reduce((sum, value) => sum + Number(value), 0);
    const { ctx } = chart;
    const titleColor = resolveCssVar('--color-text-primary') || '#0f172a';
    const subtitleColor = resolveCssVar('--color-text-tertiary') || '#94a3b8';

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = titleColor;
    ctx.font = '600 22px Inter, system-ui, sans-serif';
    ctx.fillText(String(total), x, y - 6);
    ctx.fillStyle = subtitleColor;
    ctx.font = '500 11px Inter, system-ui, sans-serif';
    ctx.fillText('Total Deals', x, y + 14);
    ctx.restore();
  },
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
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  readonly userName = this.authService.currentUser?.name?.split(' ')[0] ?? '';

  readonly kpis$ = this.store.select(selectDashboardKpis);
  readonly recentActivities$ = this.store.select(selectRecentActivities);
  readonly topOpenDeals$ = this.store.select(selectTopOpenDeals);
  readonly stageSummary$ = this.store.select(selectDealsByStageSummary);

  readonly activeStageSummary$ = this.stageSummary$.pipe(
    map((summary) => summary.filter((s) => ACTIVE_STAGES.includes(s.stage) && s.count > 0)),
  );

  readonly doughnutData$ = this.activeStageSummary$.pipe(
    map((summary): ChartData<'doughnut'> => {
      const colors = resolvedStageColors();
      return {
        labels: summary.map((s) => STAGE_LABELS[s.stage]),
        datasets: [
          {
            data: summary.map((s) => s.count),
            backgroundColor: summary.map((s) => colors[s.stage]),
            borderWidth: 3,
            borderColor: resolveCssVar('--color-bg-surface') || '#ffffff',
            hoverOffset: 4,
          },
        ],
      };
    }),
  );

  readonly lineData$ = this.store.select(selectMonthlyPipelineValue).pipe(
    map((months): ChartData<'line'> => {
      const primary = resolveCssVar('--color-primary') || '#2563eb';
      return {
        labels: months.map((m) => m.label),
        datasets: [
          {
            data: months.map((m) => m.value),
            label: 'Pipeline',
            borderColor: primary,
            backgroundColor: primary + '33',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            borderWidth: 2,
          },
        ],
      };
    }),
  );

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {};
  lineOptions: ChartConfiguration<'line'>['options'] = {};
  readonly doughnutPlugins = [DOUGHNUT_CENTER_TEXT_PLUGIN];

  private buildChartOptions(): void {
    const tickColor = resolveCssVar('--color-text-tertiary') || '#94a3b8';
    const gridColor = resolveCssVar('--color-border') || '#e2e8f0';
    const surface = resolveCssVar('--color-bg-surface') || '#ffffff';
    const primary = resolveCssVar('--color-primary') || '#2563eb';

    this.doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: surface,
          titleColor: resolveCssVar('--color-text-primary') || '#0f172a',
          bodyColor: resolveCssVar('--color-text-secondary') || '#475569',
          borderColor: gridColor,
          borderWidth: 1,
          padding: 10,
        },
      },
      cutout: '72%',
    };

    this.lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: surface,
          titleColor: resolveCssVar('--color-text-primary') || '#0f172a',
          bodyColor: resolveCssVar('--color-text-secondary') || '#475569',
          borderColor: gridColor,
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed.y ?? 0;
              if (value >= 1_000_000) return ` $${(value / 1_000_000).toFixed(2)}M`;
              if (value >= 1_000) return ` $${(value / 1_000).toFixed(0)}K`;
              return ` $${value.toLocaleString('en-US')}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: tickColor, font: { size: 11 } },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: tickColor,
            font: { size: 11 },
            maxTicksLimit: 5,
            callback: (value) => {
              const n = Number(value);
              if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
              if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
              return `$${n}`;
            },
          },
          grid: { color: gridColor + '88' },
          border: { display: false },
        },
      },
      elements: {
        line: {
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return primary + '20';
            }
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, primary + '55');
            gradient.addColorStop(1, primary + '05');
            return gradient;
          },
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

  onNewActivity(): void {
    this.dialog.open(LogActivityDialog, {
      width: '520px',
      maxWidth: '95vw',
      data: {},
    });
  }

  stageLabel(stage: DealStage): string {
    return STAGE_LABELS[stage];
  }

  stageColor(stage: DealStage): string {
    return STAGE_COLORS[stage];
  }

  stagePercent(item: { count: number }, summary: { count: number }[]): string {
    const total = summary.reduce((sum, row) => sum + row.count, 0);
    if (!total) {
      return '0';
    }
    return String(Math.round((item.count / total) * 100));
  }

  activityIcon(type: string): string {
    return ACTIVITY_ICONS[type] ?? 'event';
  }

  activityColor(type: string): string {
    return ACTIVITY_COLORS[type] ?? '#64748b';
  }

  activityIconBg(type: string): string {
    return ACTIVITY_ICON_BG[type] ?? '#f1f5f9';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatActivityTime(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
