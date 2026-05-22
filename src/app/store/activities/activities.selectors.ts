import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Activity } from '../../core/models';
import { activitiesAdapter, ActivitiesState } from './activities.reducer';

export const selectActivitiesState = createFeatureSelector<ActivitiesState>('activities');

const { selectAll, selectEntities, selectIds, selectTotal } = activitiesAdapter.getSelectors(selectActivitiesState);

export const selectAllActivities = selectAll;
export const selectActivityEntities = selectEntities;
export const selectActivityIds = selectIds;
export const selectActivitiesTotal = selectTotal;

export const selectActivitiesFilter = createSelector(selectActivitiesState, (state) => state.filter);
export const selectActivitiesSort = createSelector(selectActivitiesState, (state) => state.sort);
export const selectActivitiesPagination = createSelector(selectActivitiesState, (state) => state.pagination);
export const selectActivitiesLoading = createSelector(selectActivitiesState, (state) => state.loading);
export const selectActivitiesError = createSelector(selectActivitiesState, (state) => state.error);
export const selectSelectedActivityId = createSelector(selectActivitiesState, (state) => state.selectedId);

export const selectSelectedActivity = createSelector(
  selectActivityEntities,
  selectSelectedActivityId,
  (entities, selectedId) => (selectedId ? entities[selectedId] ?? null : null),
);

export const selectActivityById = (id: string) =>
  createSelector(selectActivityEntities, (entities) => entities[id] ?? null);

const matchesActivityFilter = (activity: Activity, filter: ActivitiesState['filter']): boolean => {
  if (filter.type && filter.type !== 'all' && activity.type !== filter.type) {
    return false;
  }
  if (filter.status && filter.status !== 'all' && activity.status !== filter.status) {
    return false;
  }
  if (filter.owner && activity.owner !== filter.owner) {
    return false;
  }
  if (filter.contactId && activity.contactId !== filter.contactId) {
    return false;
  }
  if (filter.dealId && activity.dealId !== filter.dealId) {
    return false;
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    const haystack = [activity.title, activity.description ?? '', activity.contactName ?? ''].join(' ').toLowerCase();
    if (!haystack.includes(q)) {
      return false;
    }
  }
  if (filter.dateFrom && activity.dueDate) {
    if (new Date(activity.dueDate) < new Date(filter.dateFrom)) {
      return false;
    }
  }
  if (filter.dateTo && activity.dueDate) {
    const end = new Date(filter.dateTo);
    end.setHours(23, 59, 59, 999);
    if (new Date(activity.dueDate) > end) {
      return false;
    }
  }
  if ((filter.dateFrom || filter.dateTo) && !activity.dueDate) {
    return false;
  }
  return true;
};

const sortActivities = (activities: Activity[], sort: ActivitiesState['sort']): Activity[] => {
  const sorted = [...activities];
  sorted.sort((a, b) => {
    const aVal = a[sort.field] ?? '';
    const bVal = b[sort.field] ?? '';
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

export const selectFilteredActivities = createSelector(
  selectAllActivities,
  selectActivitiesFilter,
  selectActivitiesSort,
  (activities, filter, sort) =>
    sortActivities(activities.filter((a) => matchesActivityFilter(a, filter)), sort),
);

export const selectActivitiesTotalCount = createSelector(
  selectFilteredActivities,
  (activities) => activities.length,
);

export const selectPaginatedActivities = createSelector(
  selectFilteredActivities,
  selectActivitiesPagination,
  (activities, pagination) => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return activities.slice(start, start + pagination.pageSize);
  },
);

export const selectPendingActivitiesCount = createSelector(
  selectAllActivities,
  (activities) => activities.filter((a) => a.status === 'pending').length,
);

const isSameCalendarDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const selectActivitiesDueToday = createSelector(selectAllActivities, (activities) => {
  const today = new Date();
  return activities.filter((a) => {
    if (a.status !== 'pending' || !a.dueDate) {
      return false;
    }
    return isSameCalendarDay(new Date(a.dueDate), today);
  }).length;
});

export const selectOverdueActivitiesCount = createSelector(selectAllActivities, (activities) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return activities.filter((a) => {
    if (a.status !== 'pending' || !a.dueDate) {
      return false;
    }
    const due = new Date(a.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;
});

export const selectRecentActivities = createSelector(selectAllActivities, (activities) =>
  [...activities].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10),
);
