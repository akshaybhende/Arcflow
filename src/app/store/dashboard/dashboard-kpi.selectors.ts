import { createSelector } from '@ngrx/store';
import { seededRandom } from '../../shared/utils/seeded-random';
import { selectContactsTotal } from '../contacts/contacts.selectors';
import { selectDealsTotal } from '../deals/deals.selectors';

export type DashboardKpiTrendDirection = 'up' | 'down' | 'neutral';

export interface DashboardKpiTrend {
  label: string;
  direction: DashboardKpiTrendDirection;
}

export interface DashboardKpis {
  pipelineValue: number;
  contactsTotal: number;
  wonDealsCount: number;
  activitiesDueToday: number;
  pipelineTrend: DashboardKpiTrend;
  contactsTrend: DashboardKpiTrend;
  wonDealsTrend: DashboardKpiTrend;
  activitiesTrend: DashboardKpiTrend;
}

const selectDashboardKpiSeed = createSelector(
  selectContactsTotal,
  selectDealsTotal,
  (contacts, deals) => (contacts + 1) * 997 + (deals + 1) * 1009,
);

function randomPercentTrend(rand: () => number, likelyUp = true): DashboardKpiTrend {
  const pct = (rand() * 14 + 0.6).toFixed(1);
  const up = likelyUp ? rand() > 0.22 : rand() > 0.55;
  return {
    label: `${up ? '↑' : '↓'} ${pct}%`,
    direction: up ? 'up' : 'down',
  };
}

export const selectDashboardKpis = createSelector(selectDashboardKpiSeed, (seed): DashboardKpis => {
  const rand = seededRandom(seed || 42);

  const pipelineValue = Math.round(1_350_000 + rand() * 1_350_000);
  const contactsTotal = Math.round(20 + rand() * 25);
  const wonDealsCount = Math.round(2 + rand() * 14);
  const activitiesDueToday = Math.round(rand() * 7);

  let activitiesTrend: DashboardKpiTrend;
  if (activitiesDueToday === 0) {
    activitiesTrend = { label: '↑ On track', direction: 'up' };
  } else if (rand() > 0.45) {
    const overdue = Math.max(1, Math.round(rand() * activitiesDueToday));
    activitiesTrend = { label: `↓ ${overdue} overdue`, direction: 'down' };
  } else {
    activitiesTrend = randomPercentTrend(rand, true);
  }

  return {
    pipelineValue,
    contactsTotal,
    wonDealsCount,
    activitiesDueToday,
    pipelineTrend: randomPercentTrend(rand, true),
    contactsTrend: randomPercentTrend(rand, true),
    wonDealsTrend: randomPercentTrend(rand, true),
    activitiesTrend,
  };
});

export const selectMonthlyPipelineValue = createSelector(selectDashboardKpis, (kpis) => {
  const now = new Date();
  const rand = seededRandom(kpis.pipelineValue);
  const weights: number[] = [];

  for (let i = 0; i < 6; i++) {
    const trend = 0.45 + i * 0.1;
    const noise = 0.85 + rand() * 0.3;
    weights.push(trend * noise);
  }

  const weightSum = weights.reduce((sum, w) => sum + w, 0);
  const months: { label: string; value: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = date.toLocaleString('en-US', { month: 'short' });
    const index = 5 - i;
    const value = Math.round((weights[index] / weightSum) * kpis.pipelineValue);
    months.push({ label, value });
  }

  if (months.length) {
    months[months.length - 1].value = kpis.pipelineValue;
  }

  return months;
});
