import { Activity } from '../../core/models';
import * as ActivitiesActions from './activities.actions';
import { activitiesReducer, initialActivitiesState } from './activities.reducer';

const sampleActivity: Activity = {
  id: 'a1',
  type: 'call',
  title: 'Follow-up call',
  status: 'pending',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  owner: 'Demo User',
};

describe('activitiesReducer', () => {
  it('sets loading on loadActivities', () => {
    const state = activitiesReducer(initialActivitiesState, ActivitiesActions.loadActivities());
    expect(state.loading).toBe(true);
  });

  it('stores activities on loadActivitiesSuccess', () => {
    const state = activitiesReducer(
      { ...initialActivitiesState, loading: true },
      ActivitiesActions.loadActivitiesSuccess({ activities: [sampleActivity] }),
    );
    expect(state.loading).toBe(false);
    expect(state.ids).toContain('a1');
  });
});
