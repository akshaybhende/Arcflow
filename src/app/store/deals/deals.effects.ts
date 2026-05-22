import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { DealsService } from '../../core/services/deals.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  createDeal,
  createDealFailure,
  createDealSuccess,
  deleteDeal,
  deleteDealFailure,
  deleteDealSuccess,
  loadDeal,
  loadDealFailure,
  loadDealSuccess,
  loadDeals,
  loadDealsFailure,
  loadDealsSuccess,
  updateDeal,
  updateDealFailure,
  updateDealSuccess,
} from './deals.actions';

@Injectable()
export class DealsEffects {
  loadDeals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDeals),
      mergeMap(() =>
        this.dealsService.getAll().pipe(
          map((deals) => loadDealsSuccess({ deals })),
          catchError((err: Error) => of(loadDealsFailure({ error: err.message ?? 'Failed to load deals' }))),
        ),
      ),
    ),
  );

  loadDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDeal),
      mergeMap(({ id }) =>
        this.dealsService.getById(id).pipe(
          map((deal) => loadDealSuccess({ deal })),
          catchError((err: Error) => of(loadDealFailure({ error: err.message ?? 'Failed to load deal' }))),
        ),
      ),
    ),
  );

  createDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createDeal),
      mergeMap(({ deal }) =>
        this.dealsService.create(deal).pipe(
          map((created) => createDealSuccess({ deal: created })),
          catchError((err: Error) => of(createDealFailure({ error: err.message ?? 'Failed to create deal' }))),
        ),
      ),
    ),
  );

  createDealSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createDealSuccess),
        tap(() => this.notificationService.success('Deal created successfully')),
      ),
    { dispatch: false },
  );

  updateDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateDeal),
      mergeMap(({ deal }) =>
        this.dealsService.update(deal).pipe(
          map((updated) => updateDealSuccess({ deal: updated })),
          catchError((err: Error) => of(updateDealFailure({ error: err.message ?? 'Failed to update deal' }))),
        ),
      ),
    ),
  );

  updateDealSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateDealSuccess),
        tap(() => this.notificationService.success('Deal updated successfully')),
      ),
    { dispatch: false },
  );

  deleteDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteDeal),
      mergeMap(({ id }) =>
        this.dealsService.delete(id).pipe(
          map(() => deleteDealSuccess({ id })),
          catchError((err: Error) => of(deleteDealFailure({ error: err.message ?? 'Failed to delete deal' }))),
        ),
      ),
    ),
  );

  deleteDealSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteDealSuccess),
        tap(() => this.notificationService.success('Deal deleted successfully')),
      ),
    { dispatch: false },
  );

  mutationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          createDealFailure,
          updateDealFailure,
          deleteDealFailure,
          loadDealsFailure,
          loadDealFailure,
        ),
        tap(({ error }) => this.notificationService.error(error)),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dealsService: DealsService,
    private readonly notificationService: NotificationService,
  ) {}
}
