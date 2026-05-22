import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Company } from '../../core/models';
import {
  CompaniesFilter,
  CompaniesSort,
  createCompanySuccess,
  deleteCompanySuccess,
  loadCompanies,
  loadCompaniesFailure,
  loadCompaniesSuccess,
  loadCompanySuccess,
  PaginationState,
  setCompaniesFilter,
  setCompaniesPage,
  setCompaniesSort,
  setSelectedCompany,
  updateCompanySuccess,
} from './companies.actions';

export interface CompaniesState extends EntityState<Company> {
  filter: CompaniesFilter;
  sort: CompaniesSort;
  pagination: PaginationState;
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

export const companiesAdapter = createEntityAdapter<Company>();

export const initialCompaniesState: CompaniesState = companiesAdapter.getInitialState({
  filter: {},
  sort: { field: 'name', direction: 'asc' },
  pagination: { page: 1, pageSize: 10 },
  selectedId: null,
  loading: false,
  error: null,
});

export const companiesReducer = createReducer(
  initialCompaniesState,
  on(loadCompanies, (state) => ({ ...state, loading: true, error: null })),
  on(loadCompaniesSuccess, (state, { companies }) =>
    companiesAdapter.setAll(companies, { ...state, loading: false, error: null }),
  ),
  on(loadCompaniesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(loadCompanySuccess, (state, { company }) => companiesAdapter.upsertOne(company, state)),
  on(createCompanySuccess, (state, { company }) => companiesAdapter.addOne(company, state)),
  on(updateCompanySuccess, (state, { company }) => companiesAdapter.upsertOne(company, state)),
  on(deleteCompanySuccess, (state, { id }) => companiesAdapter.removeOne(id, state)),
  on(setCompaniesFilter, (state, { filter }) => ({
    ...state,
    filter,
    pagination: { ...state.pagination, page: 1 },
  })),
  on(setCompaniesSort, (state, { sort }) => ({ ...state, sort })),
  on(setCompaniesPage, (state, { page, pageSize }) => ({
    ...state,
    pagination: { page, pageSize },
  })),
  on(setSelectedCompany, (state, { id }) => ({ ...state, selectedId: id })),
);
