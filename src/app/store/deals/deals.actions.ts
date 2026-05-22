import { createAction, props } from '@ngrx/store';
import { Deal, DealPriority, DealStage } from '../../core/models';

export interface DealsFilter {
  search?: string;
  stage?: DealStage | 'all';
  priority?: DealPriority | 'all';
  owner?: string;
}

export type DealsSortField = 'title' | 'value' | 'stage' | 'expectedCloseDate' | 'createdAt' | 'updatedAt';

export interface DealsSort {
  field: DealsSortField;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const loadDeals = createAction('[Deals] Load Deals');
export const loadDealsSuccess = createAction('[Deals] Load Deals Success', props<{ deals: Deal[] }>());
export const loadDealsFailure = createAction('[Deals] Load Deals Failure', props<{ error: string }>());

export const loadDeal = createAction('[Deals] Load Deal', props<{ id: string }>());
export const loadDealSuccess = createAction('[Deals] Load Deal Success', props<{ deal: Deal }>());
export const loadDealFailure = createAction('[Deals] Load Deal Failure', props<{ error: string }>());

export const createDeal = createAction(
  '[Deals] Create Deal',
  props<{ deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> }>(),
);
export const createDealSuccess = createAction('[Deals] Create Deal Success', props<{ deal: Deal }>());
export const createDealFailure = createAction('[Deals] Create Deal Failure', props<{ error: string }>());

export const updateDeal = createAction('[Deals] Update Deal', props<{ deal: Deal }>());
export const updateDealSuccess = createAction('[Deals] Update Deal Success', props<{ deal: Deal }>());
export const updateDealFailure = createAction('[Deals] Update Deal Failure', props<{ error: string }>());

export const deleteDeal = createAction('[Deals] Delete Deal', props<{ id: string }>());
export const deleteDealSuccess = createAction('[Deals] Delete Deal Success', props<{ id: string }>());
export const deleteDealFailure = createAction('[Deals] Delete Deal Failure', props<{ error: string }>());

export const setDealsFilter = createAction('[Deals] Set Filter', props<{ filter: DealsFilter }>());
export const setDealsSort = createAction('[Deals] Set Sort', props<{ sort: DealsSort }>());
export const setDealsPage = createAction('[Deals] Set Page', props<{ page: number; pageSize: number }>());
export const setSelectedDeal = createAction('[Deals] Set Selected', props<{ id: string | null }>());
