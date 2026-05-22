import { Deal } from '../../core/models';
import * as DealsActions from './deals.actions';
import { dealsReducer, initialDealsState } from './deals.reducer';

const sampleDeal: Deal = {
  id: 'd1',
  title: 'Test Deal',
  contactId: 'c1',
  contactName: 'Jane Doe',
  stage: 'lead',
  value: 1000,
  currency: 'USD',
  priority: 'medium',
  probability: 50,
  expectedCloseDate: '2026-06-01T00:00:00.000Z',
  tags: [],
  activityIds: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  owner: 'Demo User',
};

describe('dealsReducer', () => {
  it('sets loading on loadDeals', () => {
    const state = dealsReducer(initialDealsState, DealsActions.loadDeals());
    expect(state.loading).toBe(true);
  });

  it('stores deals on loadDealsSuccess', () => {
    const state = dealsReducer(
      { ...initialDealsState, loading: true },
      DealsActions.loadDealsSuccess({ deals: [sampleDeal] }),
    );
    expect(state.loading).toBe(false);
    expect(state.ids).toContain('d1');
  });
});
