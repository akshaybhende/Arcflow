import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Contact } from '../../core/models';
import {
  ContactsFilter,
  ContactsSort,
  createContactSuccess,
  deleteContactSuccess,
  loadContactSuccess,
  loadContacts,
  loadContactsFailure,
  loadContactsSuccess,
  PaginationState,
  setContactsFilter,
  setContactsPage,
  setContactsSort,
  setSelectedContact,
  updateContactSuccess,
} from './contacts.actions';

export interface ContactsState extends EntityState<Contact> {
  filter: ContactsFilter;
  sort: ContactsSort;
  pagination: PaginationState;
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

export const contactsAdapter = createEntityAdapter<Contact>();

export const initialContactsState: ContactsState = contactsAdapter.getInitialState({
  filter: {},
  sort: { field: 'updatedAt', direction: 'desc' },
  pagination: { page: 1, pageSize: 10 },
  selectedId: null,
  loading: false,
  error: null,
});

export const contactsReducer = createReducer(
  initialContactsState,
  on(loadContacts, (state) => ({ ...state, loading: true, error: null })),
  on(loadContactsSuccess, (state, { contacts }) =>
    contactsAdapter.setAll(contacts, { ...state, loading: false, error: null }),
  ),
  on(loadContactsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(loadContactSuccess, (state, { contact }) => contactsAdapter.upsertOne(contact, state)),
  on(createContactSuccess, (state, { contact }) => contactsAdapter.addOne(contact, state)),
  on(updateContactSuccess, (state, { contact }) => contactsAdapter.upsertOne(contact, state)),
  on(deleteContactSuccess, (state, { id }) => contactsAdapter.removeOne(id, state)),
  on(setContactsFilter, (state, { filter }) => ({
    ...state,
    filter,
    pagination: { ...state.pagination, page: 1 },
  })),
  on(setContactsSort, (state, { sort }) => ({ ...state, sort })),
  on(setContactsPage, (state, { page, pageSize }) => ({
    ...state,
    pagination: { page, pageSize },
  })),
  on(setSelectedContact, (state, { id }) => ({ ...state, selectedId: id })),
);
