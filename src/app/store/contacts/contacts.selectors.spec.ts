import { Contact } from '../../core/models';
import * as ContactsActions from './contacts.actions';
import { contactsReducer, initialContactsState } from './contacts.reducer';
import { selectContactsTotalCount, selectFilteredContacts } from './contacts.selectors';

const contacts: Contact[] = [
  {
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
    owner: 'Demo',
  },
  {
    id: 'c2',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    status: 'prospect',
    leadSource: 'referral',
    tags: [],
    dealIds: [],
    activityIds: [],
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    owner: 'Demo',
  },
];

describe('contacts selectors', () => {
  const state = {
    contacts: contactsReducer(
      initialContactsState,
      ContactsActions.loadContactsSuccess({ contacts }),
    ),
  };

  it('selectContactsTotalCount returns entity count', () => {
    expect(selectContactsTotalCount(state)).toBe(2);
  });

  it('selectFilteredContacts filters by search', () => {
    const filtered = selectFilteredContacts({
      contacts: contactsReducer(
        state.contacts,
        ContactsActions.setContactsFilter({ filter: { search: 'jane' } }),
      ),
    });
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('c1');
  });
});
