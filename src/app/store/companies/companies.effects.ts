import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { CompaniesService } from '../../core/services/companies.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  createCompany,
  createCompanyFailure,
  createCompanySuccess,
  deleteCompany,
  deleteCompanyFailure,
  deleteCompanySuccess,
  loadCompanies,
  loadCompaniesFailure,
  loadCompaniesSuccess,
  loadCompany,
  loadCompanyFailure,
  loadCompanySuccess,
  updateCompany,
  updateCompanyFailure,
  updateCompanySuccess,
} from './companies.actions';

@Injectable()
export class CompaniesEffects {
  loadCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCompanies),
      mergeMap(() =>
        this.companiesService.getAll().pipe(
          map((companies) => loadCompaniesSuccess({ companies })),
          catchError((err: Error) =>
            of(loadCompaniesFailure({ error: err.message ?? 'Failed to load companies' })),
          ),
        ),
      ),
    ),
  );

  loadCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCompany),
      mergeMap(({ id }) =>
        this.companiesService.getById(id).pipe(
          map((company) => loadCompanySuccess({ company })),
          catchError((err: Error) =>
            of(loadCompanyFailure({ error: err.message ?? 'Failed to load company' })),
          ),
        ),
      ),
    ),
  );

  createCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCompany),
      mergeMap(({ company }) =>
        this.companiesService.create(company).pipe(
          map((created) => createCompanySuccess({ company: created })),
          catchError((err: Error) =>
            of(createCompanyFailure({ error: err.message ?? 'Failed to create company' })),
          ),
        ),
      ),
    ),
  );

  createCompanySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createCompanySuccess),
        tap(() => this.notificationService.success('Company created successfully')),
      ),
    { dispatch: false },
  );

  updateCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCompany),
      mergeMap(({ company }) =>
        this.companiesService.update(company).pipe(
          map((updated) => updateCompanySuccess({ company: updated })),
          catchError((err: Error) =>
            of(updateCompanyFailure({ error: err.message ?? 'Failed to update company' })),
          ),
        ),
      ),
    ),
  );

  updateCompanySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateCompanySuccess),
        tap(() => this.notificationService.success('Company updated successfully')),
      ),
    { dispatch: false },
  );

  deleteCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCompany),
      mergeMap(({ id }) =>
        this.companiesService.delete(id).pipe(
          map(() => deleteCompanySuccess({ id })),
          catchError((err: Error) =>
            of(deleteCompanyFailure({ error: err.message ?? 'Failed to delete company' })),
          ),
        ),
      ),
    ),
  );

  deleteCompanySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteCompanySuccess),
        tap(() => this.notificationService.success('Company deleted successfully')),
      ),
    { dispatch: false },
  );

  mutationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createCompanyFailure, updateCompanyFailure, deleteCompanyFailure, loadCompaniesFailure),
        tap(({ error }) => this.notificationService.error(error)),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly companiesService: CompaniesService,
    private readonly notificationService: NotificationService,
  ) {}
}
