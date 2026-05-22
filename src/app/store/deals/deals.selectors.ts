import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Deal, DealStage } from '../../core/models';
import { dealsAdapter, DealsState } from './deals.reducer';

export const DEAL_STAGES: DealStage[] = [
  'lead',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

export const selectDealsState = createFeatureSelector<DealsState>('deals');

const { selectAll, selectEntities, selectIds, selectTotal } = dealsAdapter.getSelectors(selectDealsState);

export const selectAllDeals = selectAll;
export const selectDealEntities = selectEntities;
export const selectDealIds = selectIds;
export const selectDealsTotal = selectTotal;

export const selectDealsFilter = createSelector(selectDealsState, (state) => state.filter);
export const selectDealsSort = createSelector(selectDealsState, (state) => state.sort);
export const selectDealsPagination = createSelector(selectDealsState, (state) => state.pagination);
export const selectDealsLoading = createSelector(selectDealsState, (state) => state.loading);
export const selectDealsError = createSelector(selectDealsState, (state) => state.error);
export const selectSelectedDealId = createSelector(selectDealsState, (state) => state.selectedId);

export const selectSelectedDeal = createSelector(
  selectDealEntities,
  selectSelectedDealId,
  (entities, selectedId) => (selectedId ? entities[selectedId] ?? null : null),
);

export const selectDealById = (id: string) =>
  createSelector(selectDealEntities, (entities) => entities[id] ?? null);

const matchesDealFilter = (deal: Deal, filter: DealsState['filter']): boolean => {
  if (filter.stage && filter.stage !== 'all' && deal.stage !== filter.stage) {
    return false;
  }
  if (filter.priority && filter.priority !== 'all' && deal.priority !== filter.priority) {
    return false;
  }
  if (filter.owner && deal.owner !== filter.owner) {
    return false;
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    const haystack = [deal.title, deal.contactName, deal.companyName ?? ''].join(' ').toLowerCase();
    if (!haystack.includes(q)) {
      return false;
    }
  }
  return true;
};

const sortDeals = (deals: Deal[], sort: DealsState['sort']): Deal[] => {
  const sorted = [...deals];
  sorted.sort((a, b) => {
    const aVal = a[sort.field];
    const bVal = b[sort.field];
    if (aVal < bVal) {
      return sort.direction === 'asc' ? -1 : 1;
    }
    if (aVal > bVal) {
      return sort.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  return sorted;
};

export const selectFilteredDeals = createSelector(
  selectAllDeals,
  selectDealsFilter,
  selectDealsSort,
  (deals, filter, sort) => sortDeals(deals.filter((d) => matchesDealFilter(d, filter)), sort),
);

export const selectDealsTotalCount = createSelector(selectFilteredDeals, (deals) => deals.length);

export const selectPaginatedDeals = createSelector(
  selectFilteredDeals,
  selectDealsPagination,
  (deals, pagination) => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return deals.slice(start, start + pagination.pageSize);
  },
);

export const selectOpenDealsCount = createSelector(
  selectAllDeals,
  (deals) => deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost').length,
);

export const selectPipelineValue = createSelector(selectFilteredDeals, (deals) =>
  deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost').reduce((sum, d) => sum + d.value, 0),
);

export const selectDealsByStage = createSelector(selectFilteredDeals, (deals) => {
  const grouped = {} as Record<DealStage, Deal[]>;
  for (const stage of DEAL_STAGES) {
    grouped[stage] = deals.filter((d) => d.stage === stage);
  }
  return grouped;
});

export const selectDealsForContact = (contactId: string) =>
  createSelector(selectAllDeals, (deals) => deals.filter((d) => d.contactId === contactId));

export const selectDealsForCompany = (companyName: string) =>
  createSelector(selectAllDeals, (deals) =>
    deals.filter((d) => d.companyName?.toLowerCase() === companyName.toLowerCase()),
  );

export const selectWonRevenueSum = createSelector(selectAllDeals, (deals) =>
  deals.filter((d) => d.stage === 'won').reduce((sum, d) => sum + d.value, 0),
);

export const selectDealsByStageSummary = createSelector(selectAllDeals, (deals) => {
  const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const;
  return stages.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    return {
      stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + d.value, 0),
    };
  });
});

export const selectTopOpenDeals = createSelector(selectAllDeals, (deals) =>
  [...deals]
    .filter((d) => d.stage !== 'won' && d.stage !== 'lost')
    .sort((a, b) => b.value - a.value)
    .slice(0, 5),
);

export const selectMonthlyWonRevenue = createSelector(selectAllDeals, (deals) => {
  const wonDeals = deals.filter((d) => d.stage === 'won');
  const now = new Date();
  const months: { label: string; value: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const label = date.toLocaleString('en-US', { month: 'short' });
    const value = wonDeals
      .filter((d) => {
        const closeDate = new Date(d.actualCloseDate ?? d.updatedAt);
        return closeDate.getFullYear() === year && closeDate.getMonth() === month;
      })
      .reduce((sum, d) => sum + d.value, 0);
    months.push({ label, value });
  }

  return months;
});
