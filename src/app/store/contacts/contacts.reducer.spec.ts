import { Contact } from '../../core/models';
import * as ContactsActions from './contacts.actions';
import { contactsReducer, initialContactsState } from './contacts.reducer';

const sampleContact: Contact = {
  id: 'c1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  status: 'active',
  leadSource: 'website',
  tags: [],
  dealIds: [],
  activityIds: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  owner: 'Alex Johnson',
};

describe('contactsReducer', () => {
  it('sets loading on loadContacts', () => {
    const state = contactsReducer(initialContactsState, ContactsActions.loadContacts());
    expect(state.loading).toBe(true);
  });

  it('stores contacts on loadContactsSuccess', () => {
    const state = contactsReducer(
      { ...initialContactsState, loading: true },
      ContactsActions.loadContactsSuccess({ contacts: [sampleContact] }),
    );
    expect(state.loading).toBe(false);
    expect(state.ids).toContain('c1');
  });

  it('removes contact on deleteContactSuccess', () => {
    const loaded = contactsReducer(
      initialContactsState,
      ContactsActions.loadContactsSuccess({ contacts: [sampleContact] }),
    );
    const state = contactsReducer(loaded, ContactsActions.deleteContactSuccess({ id: 'c1' }));
    expect(state.ids).not.toContain('c1');
  });
});
