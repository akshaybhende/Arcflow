import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Contact } from '../../core/models';
import { contactsAdapter, ContactsState } from './contacts.reducer';

export const selectContactsState = createFeatureSelector<ContactsState>('contacts');

const { selectAll, selectEntities, selectIds, selectTotal } = contactsAdapter.getSelectors(selectContactsState);

export const selectAllContacts = selectAll;
export const selectContactEntities = selectEntities;
export const selectContactIds = selectIds;
export const selectContactsTotal = selectTotal;

export const selectContactsFilter = createSelector(selectContactsState, (state) => state.filter);
export const selectContactsSort = createSelector(selectContactsState, (state) => state.sort);
export const selectContactsPagination = createSelector(selectContactsState, (state) => state.pagination);
export const selectContactsLoading = createSelector(selectContactsState, (state) => state.loading);
export const selectContactsError = createSelector(selectContactsState, (state) => state.error);
export const selectSelectedContactId = createSelector(selectContactsState, (state) => state.selectedId);

export const selectSelectedContact = createSelector(
  selectContactEntities,
  selectSelectedContactId,
  (entities, selectedId) => (selectedId ? entities[selectedId] ?? null : null),
);

export const selectContactById = (id: string) =>
  createSelector(selectContactEntities, (entities) => entities[id] ?? null);

const matchesContactFilter = (contact: Contact, filter: ContactsState['filter']): boolean => {
  if (filter.status && filter.status !== 'all' && contact.status !== filter.status) {
    return false;
  }
  if (filter.owner && contact.owner !== filter.owner) {
    return false;
  }
  if (filter.leadSource && filter.leadSource !== 'all' && contact.leadSource !== filter.leadSource) {
    return false;
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const haystack = [fullName, contact.email, contact.companyName ?? '', contact.jobTitle ?? ''].join(' ');
    if (!haystack.includes(q)) {
      return false;
    }
  }
  return true;
};

const sortContacts = (contacts: Contact[], sort: ContactsState['sort']): Contact[] => {
  const sorted = [...contacts];
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

export const selectFilteredContacts = createSelector(
  selectAllContacts,
  selectContactsFilter,
  selectContactsSort,
  (contacts, filter, sort) => sortContacts(contacts.filter((c) => matchesContactFilter(c, filter)), sort),
);

export const selectContactsTotalCount = createSelector(selectFilteredContacts, (contacts) => contacts.length);

export const selectPaginatedContacts = createSelector(
  selectFilteredContacts,
  selectContactsPagination,
  (contacts, pagination) => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return contacts.slice(start, start + pagination.pageSize);
  },
);
