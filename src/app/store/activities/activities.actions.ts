import { createAction, props } from '@ngrx/store';
import { Activity, ActivityStatus, ActivityType } from '../../core/models';

export interface ActivitiesFilter {
  search?: string;
  type?: ActivityType | 'all';
  status?: ActivityStatus | 'all';
  owner?: string;
  contactId?: string;
  dealId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export type ActivitiesSortField = 'title' | 'type' | 'status' | 'dueDate' | 'createdAt' | 'updatedAt';

export interface ActivitiesSort {
  field: ActivitiesSortField;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const loadActivities = createAction('[Activities] Load Activities');
export const loadActivitiesSuccess = createAction(
  '[Activities] Load Activities Success',
  props<{ activities: Activity[] }>(),
);
export const loadActivitiesFailure = createAction(
  '[Activities] Load Activities Failure',
  props<{ error: string }>(),
);

export const loadActivity = createAction('[Activities] Load Activity', props<{ id: string }>());
export const loadActivitySuccess = createAction(
  '[Activities] Load Activity Success',
  props<{ activity: Activity }>(),
);
export const loadActivityFailure = createAction(
  '[Activities] Load Activity Failure',
  props<{ error: string }>(),
);

export const createActivity = createAction(
  '[Activities] Create Activity',
  props<{ activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> }>(),
);
export const createActivitySuccess = createAction(
  '[Activities] Create Activity Success',
  props<{ activity: Activity }>(),
);
export const createActivityFailure = createAction(
  '[Activities] Create Activity Failure',
  props<{ error: string }>(),
);

export const updateActivity = createAction('[Activities] Update Activity', props<{ activity: Activity }>());
export const updateActivitySuccess = createAction(
  '[Activities] Update Activity Success',
  props<{ activity: Activity }>(),
);
export const updateActivityFailure = createAction(
  '[Activities] Update Activity Failure',
  props<{ error: string }>(),
);

export const deleteActivity = createAction('[Activities] Delete Activity', props<{ id: string }>());
export const deleteActivitySuccess = createAction(
  '[Activities] Delete Activity Success',
  props<{ id: string }>(),
);
export const deleteActivityFailure = createAction(
  '[Activities] Delete Activity Failure',
  props<{ error: string }>(),
);

export const setActivitiesFilter = createAction('[Activities] Set Filter', props<{ filter: ActivitiesFilter }>());
export const setActivitiesSort = createAction('[Activities] Set Sort', props<{ sort: ActivitiesSort }>());
export const setActivitiesPage = createAction(
  '[Activities] Set Page',
  props<{ page: number; pageSize: number }>(),
);
export const setSelectedActivity = createAction('[Activities] Set Selected', props<{ id: string | null }>());
