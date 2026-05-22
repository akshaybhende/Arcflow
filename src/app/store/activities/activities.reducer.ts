import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Activity } from '../../core/models';
import {
  ActivitiesFilter,
  ActivitiesSort,
  createActivitySuccess,
  deleteActivitySuccess,
  loadActivities,
  loadActivitiesFailure,
  loadActivitiesSuccess,
  loadActivitySuccess,
  PaginationState,
  setActivitiesFilter,
  setActivitiesPage,
  setActivitiesSort,
  setSelectedActivity,
  updateActivitySuccess,
} from './activities.actions';

export interface ActivitiesState extends EntityState<Activity> {
  filter: ActivitiesFilter;
  sort: ActivitiesSort;
  pagination: PaginationState;
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

export const activitiesAdapter = createEntityAdapter<Activity>();

export const initialActivitiesState: ActivitiesState = activitiesAdapter.getInitialState({
  filter: {},
  sort: { field: 'dueDate', direction: 'asc' },
  pagination: { page: 1, pageSize: 10 },
  selectedId: null,
  loading: false,
  error: null,
});

export const activitiesReducer = createReducer(
  initialActivitiesState,
  on(loadActivities, (state) => ({ ...state, loading: true, error: null })),
  on(loadActivitiesSuccess, (state, { activities }) =>
    activitiesAdapter.setAll(activities, { ...state, loading: false, error: null }),
  ),
  on(loadActivitiesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(loadActivitySuccess, (state, { activity }) => activitiesAdapter.upsertOne(activity, state)),
  on(createActivitySuccess, (state, { activity }) => activitiesAdapter.addOne(activity, state)),
  on(updateActivitySuccess, (state, { activity }) => activitiesAdapter.upsertOne(activity, state)),
  on(deleteActivitySuccess, (state, { id }) => activitiesAdapter.removeOne(id, state)),
  on(setActivitiesFilter, (state, { filter }) => ({
    ...state,
    filter,
    pagination: { ...state.pagination, page: 1 },
  })),
  on(setActivitiesSort, (state, { sort }) => ({ ...state, sort })),
  on(setActivitiesPage, (state, { page, pageSize }) => ({
    ...state,
    pagination: { page, pageSize },
  })),
  on(setSelectedActivity, (state, { id }) => ({ ...state, selectedId: id })),
);
