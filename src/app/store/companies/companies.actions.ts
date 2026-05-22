import { createAction, props } from '@ngrx/store';
import { Company, CompanyIndustry, CompanySize } from '../../core/models';

export interface CompaniesFilter {
  search?: string;
  industry?: CompanyIndustry | 'all';
  size?: CompanySize | 'all';
  owner?: string;
}

export type CompaniesSortField = 'name' | 'industry' | 'revenue' | 'createdAt' | 'updatedAt';

export interface CompaniesSort {
  field: CompaniesSortField;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const loadCompanies = createAction('[Companies] Load Companies');
export const loadCompaniesSuccess = createAction(
  '[Companies] Load Companies Success',
  props<{ companies: Company[] }>(),
);
export const loadCompaniesFailure = createAction(
  '[Companies] Load Companies Failure',
  props<{ error: string }>(),
);

export const loadCompany = createAction('[Companies] Load Company', props<{ id: string }>());
export const loadCompanySuccess = createAction(
  '[Companies] Load Company Success',
  props<{ company: Company }>(),
);
export const loadCompanyFailure = createAction(
  '[Companies] Load Company Failure',
  props<{ error: string }>(),
);

export const createCompany = createAction(
  '[Companies] Create Company',
  props<{ company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'> }>(),
);
export const createCompanySuccess = createAction(
  '[Companies] Create Company Success',
  props<{ company: Company }>(),
);
export const createCompanyFailure = createAction(
  '[Companies] Create Company Failure',
  props<{ error: string }>(),
);

export const updateCompany = createAction('[Companies] Update Company', props<{ company: Company }>());
export const updateCompanySuccess = createAction(
  '[Companies] Update Company Success',
  props<{ company: Company }>(),
);
export const updateCompanyFailure = createAction(
  '[Companies] Update Company Failure',
  props<{ error: string }>(),
);

export const deleteCompany = createAction('[Companies] Delete Company', props<{ id: string }>());
export const deleteCompanySuccess = createAction(
  '[Companies] Delete Company Success',
  props<{ id: string }>(),
);
export const deleteCompanyFailure = createAction(
  '[Companies] Delete Company Failure',
  props<{ error: string }>(),
);

export const setCompaniesFilter = createAction('[Companies] Set Filter', props<{ filter: CompaniesFilter }>());
export const setCompaniesSort = createAction('[Companies] Set Sort', props<{ sort: CompaniesSort }>());
export const setCompaniesPage = createAction(
  '[Companies] Set Page',
  props<{ page: number; pageSize: number }>(),
);
export const setSelectedCompany = createAction('[Companies] Set Selected', props<{ id: string | null }>());
