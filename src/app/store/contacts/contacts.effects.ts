import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ContactsService } from '../../core/services/contacts.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  createContact,
  createContactFailure,
  createContactSuccess,
  deleteContact,
  deleteContactFailure,
  deleteContactSuccess,
  loadContact,
  loadContactFailure,
  loadContactSuccess,
  loadContacts,
  loadContactsFailure,
  loadContactsSuccess,
  updateContact,
  updateContactFailure,
  updateContactSuccess,
} from './contacts.actions';

@Injectable()
export class ContactsEffects {
  private readonly actions$ = inject(Actions);
  private readonly contactsService = inject(ContactsService);
  private readonly notificationService = inject(NotificationService);

  loadContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContacts),
      mergeMap(() =>
        this.contactsService.getAll().pipe(
          map((contacts) => loadContactsSuccess({ contacts })),
          catchError((err: Error) =>
            of(loadContactsFailure({ error: err.message ?? 'Failed to load contacts' })),
          ),
        ),
      ),
    ),
  );

  loadContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContact),
      mergeMap(({ id }) =>
        this.contactsService.getById(id).pipe(
          map((contact) => loadContactSuccess({ contact })),
          catchError((err: Error) =>
            of(loadContactFailure({ error: err.message ?? 'Failed to load contact' })),
          ),
        ),
      ),
    ),
  );

  createContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createContact),
      mergeMap(({ contact }) =>
        this.contactsService.create(contact).pipe(
          map((created) => createContactSuccess({ contact: created })),
          catchError((err: Error) =>
            of(createContactFailure({ error: err.message ?? 'Failed to create contact' })),
          ),
        ),
      ),
    ),
  );

  createContactSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createContactSuccess),
        tap(() => this.notificationService.success('Contact created successfully')),
      ),
    { dispatch: false },
  );

  updateContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateContact),
      mergeMap(({ contact }) =>
        this.contactsService.update(contact).pipe(
          map((updated) => updateContactSuccess({ contact: updated })),
          catchError((err: Error) =>
            of(updateContactFailure({ error: err.message ?? 'Failed to update contact' })),
          ),
        ),
      ),
    ),
  );

  updateContactSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateContactSuccess),
        tap(() => this.notificationService.success('Contact updated successfully')),
      ),
    { dispatch: false },
  );

  deleteContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteContact),
      mergeMap(({ id }) =>
        this.contactsService.delete(id).pipe(
          map(() => deleteContactSuccess({ id })),
          catchError((err: Error) =>
            of(deleteContactFailure({ error: err.message ?? 'Failed to delete contact' })),
          ),
        ),
      ),
    ),
  );

  deleteContactSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteContactSuccess),
        tap(() => this.notificationService.success('Contact deleted successfully')),
      ),
    { dispatch: false },
  );

  mutationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          createContactFailure,
          updateContactFailure,
          deleteContactFailure,
          loadContactsFailure,
          loadContactFailure,
        ),
        tap(({ error }) => this.notificationService.error(error)),
      ),
    { dispatch: false },
  );
}
