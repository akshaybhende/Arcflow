import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Deal } from '../../core/models';
import {
  createDealSuccess,
  DealsFilter,
  DealsSort,
  deleteDealSuccess,
  loadDealSuccess,
  loadDeals,
  loadDealsFailure,
  loadDealsSuccess,
  PaginationState,
  setDealsFilter,
  setDealsPage,
  setDealsSort,
  setSelectedDeal,
  updateDealSuccess,
} from './deals.actions';

export interface DealsState extends EntityState<Deal> {
  filter: DealsFilter;
  sort: DealsSort;
  pagination: PaginationState;
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

export const dealsAdapter = createEntityAdapter<Deal>();

export const initialDealsState: DealsState = dealsAdapter.getInitialState({
  filter: {},
  sort: { field: 'updatedAt', direction: 'desc' },
  pagination: { page: 1, pageSize: 10 },
  selectedId: null,
  loading: false,
  error: null,
});

export const dealsReducer = createReducer(
  initialDealsState,
  on(loadDeals, (state) => ({ ...state, loading: true, error: null })),
  on(loadDealsSuccess, (state, { deals }) =>
    dealsAdapter.setAll(deals, { ...state, loading: false, error: null }),
  ),
  on(loadDealsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(loadDealSuccess, (state, { deal }) => dealsAdapter.upsertOne(deal, state)),
  on(createDealSuccess, (state, { deal }) => dealsAdapter.addOne(deal, state)),
  on(updateDealSuccess, (state, { deal }) => dealsAdapter.upsertOne(deal, state)),
  on(deleteDealSuccess, (state, { id }) => dealsAdapter.removeOne(id, state)),
  on(setDealsFilter, (state, { filter }) => ({
    ...state,
    filter,
    pagination: { ...state.pagination, page: 1 },
  })),
  on(setDealsSort, (state, { sort }) => ({ ...state, sort })),
  on(setDealsPage, (state, { page, pageSize }) => ({
    ...state,
    pagination: { page, pageSize },
  })),
  on(setSelectedDeal, (state, { id }) => ({ ...state, selectedId: id })),
);
