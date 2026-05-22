import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Company } from '../../core/models';
import { companiesAdapter, CompaniesState } from './companies.reducer';

export const selectCompaniesState = createFeatureSelector<CompaniesState>('companies');

const { selectAll, selectEntities, selectIds, selectTotal } = companiesAdapter.getSelectors(selectCompaniesState);

export const selectAllCompanies = selectAll;
export const selectCompanyEntities = selectEntities;
export const selectCompanyIds = selectIds;
export const selectCompaniesTotal = selectTotal;

export const selectCompaniesFilter = createSelector(selectCompaniesState, (state) => state.filter);
export const selectCompaniesSort = createSelector(selectCompaniesState, (state) => state.sort);
export const selectCompaniesPagination = createSelector(selectCompaniesState, (state) => state.pagination);
export const selectCompaniesLoading = createSelector(selectCompaniesState, (state) => state.loading);
export const selectCompaniesError = createSelector(selectCompaniesState, (state) => state.error);
export const selectSelectedCompanyId = createSelector(selectCompaniesState, (state) => state.selectedId);

export const selectSelectedCompany = createSelector(
  selectCompanyEntities,
  selectSelectedCompanyId,
  (entities, selectedId) => (selectedId ? entities[selectedId] ?? null : null),
);

export const selectCompanyById = (id: string) =>
  createSelector(selectCompanyEntities, (entities) => entities[id] ?? null);

const matchesCompanyFilter = (company: Company, filter: CompaniesState['filter']): boolean => {
  if (filter.industry && filter.industry !== 'all' && company.industry !== filter.industry) {
    return false;
  }
  if (filter.size && filter.size !== 'all' && company.size !== filter.size) {
    return false;
  }
  if (filter.owner && company.owner !== filter.owner) {
    return false;
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    const haystack = [company.name, company.domain ?? '', company.industry].join(' ').toLowerCase();
    if (!haystack.includes(q)) {
      return false;
    }
  }
  return true;
};

const sortCompanies = (companies: Company[], sort: CompaniesState['sort']): Company[] => {
  const sorted = [...companies];
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

export const selectFilteredCompanies = createSelector(
  selectAllCompanies,
  selectCompaniesFilter,
  selectCompaniesSort,
  (companies, filter, sort) =>
    sortCompanies(companies.filter((c) => matchesCompanyFilter(c, filter)), sort),
);

export const selectCompaniesTotalCount = createSelector(
  selectFilteredCompanies,
  (companies) => companies.length,
);

export const selectPaginatedCompanies = createSelector(
  selectFilteredCompanies,
  selectCompaniesPagination,
  (companies, pagination) => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return companies.slice(start, start + pagination.pageSize);
  },
);

export const selectCompanyOwners = createSelector(selectAllCompanies, (companies) => [
  ...new Set(companies.map((c) => c.owner)),
]);
