import { createAction, props } from '@ngrx/store';
import { Contact, ContactStatus, LeadSource } from '../../core/models';

export interface ContactsFilter {
  search?: string;
  status?: ContactStatus | 'all';
  owner?: string;
  leadSource?: LeadSource | 'all';
}

export type ContactsSortField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'companyName'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'lastContactedAt';

export interface ContactsSort {
  field: ContactsSortField;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const loadContacts = createAction('[Contacts] Load Contacts');
export const loadContactsSuccess = createAction(
  '[Contacts] Load Contacts Success',
  props<{ contacts: Contact[] }>(),
);
export const loadContactsFailure = createAction(
  '[Contacts] Load Contacts Failure',
  props<{ error: string }>(),
);

export const loadContact = createAction('[Contacts] Load Contact', props<{ id: string }>());
export const loadContactSuccess = createAction(
  '[Contacts] Load Contact Success',
  props<{ contact: Contact }>(),
);
export const loadContactFailure = createAction(
  '[Contacts] Load Contact Failure',
  props<{ error: string }>(),
);

export const createContact = createAction(
  '[Contacts] Create Contact',
  props<{ contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> }>(),
);
export const createContactSuccess = createAction(
  '[Contacts] Create Contact Success',
  props<{ contact: Contact }>(),
);
export const createContactFailure = createAction(
  '[Contacts] Create Contact Failure',
  props<{ error: string }>(),
);

export const updateContact = createAction('[Contacts] Update Contact', props<{ contact: Contact }>());
export const updateContactSuccess = createAction(
  '[Contacts] Update Contact Success',
  props<{ contact: Contact }>(),
);
export const updateContactFailure = createAction(
  '[Contacts] Update Contact Failure',
  props<{ error: string }>(),
);

export const deleteContact = createAction('[Contacts] Delete Contact', props<{ id: string }>());
export const deleteContactSuccess = createAction(
  '[Contacts] Delete Contact Success',
  props<{ id: string }>(),
);
export const deleteContactFailure = createAction(
  '[Contacts] Delete Contact Failure',
  props<{ error: string }>(),
);

export const setContactsFilter = createAction('[Contacts] Set Filter', props<{ filter: ContactsFilter }>());
export const setContactsSort = createAction('[Contacts] Set Sort', props<{ sort: ContactsSort }>());
export const setContactsPage = createAction('[Contacts] Set Page', props<{ page: number; pageSize: number }>());
export const setSelectedContact = createAction('[Contacts] Set Selected', props<{ id: string | null }>());
