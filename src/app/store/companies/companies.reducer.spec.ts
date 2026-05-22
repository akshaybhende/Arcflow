import { Company } from '../../core/models';
import * as CompaniesActions from './companies.actions';
import { companiesReducer, initialCompaniesState } from './companies.reducer';

const sampleCompany: Company = {
  id: 'co1',
  name: 'Acme Corp',
  industry: 'technology',
  size: '11-50',
  contactIds: [],
  dealIds: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  owner: 'Demo User',
};

describe('companiesReducer', () => {
  it('sets loading on loadCompanies', () => {
    const state = companiesReducer(initialCompaniesState, CompaniesActions.loadCompanies());
    expect(state.loading).toBe(true);
  });

  it('stores companies on loadCompaniesSuccess', () => {
    const state = companiesReducer(
      { ...initialCompaniesState, loading: true },
      CompaniesActions.loadCompaniesSuccess({ companies: [sampleCompany] }),
    );
    expect(state.loading).toBe(false);
    expect(state.ids).toContain('co1');
  });
});
