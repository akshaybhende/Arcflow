import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { ActivitiesService } from '../../core/services/activities.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  createActivity,
  createActivityFailure,
  createActivitySuccess,
  deleteActivity,
  deleteActivityFailure,
  deleteActivitySuccess,
  loadActivities,
  loadActivitiesFailure,
  loadActivitiesSuccess,
  loadActivity,
  loadActivityFailure,
  loadActivitySuccess,
  updateActivity,
  updateActivityFailure,
  updateActivitySuccess,
} from './activities.actions';

@Injectable()
export class ActivitiesEffects {
  private readonly actions$ = inject(Actions);
  private readonly activitiesService = inject(ActivitiesService);
  private readonly notificationService = inject(NotificationService);

  loadActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadActivities),
      mergeMap(() =>
        this.activitiesService.getAll().pipe(
          map((activities) => loadActivitiesSuccess({ activities })),
          catchError((err: Error) =>
            of(loadActivitiesFailure({ error: err.message ?? 'Failed to load activities' })),
          ),
        ),
      ),
    ),
  );

  loadActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadActivity),
      mergeMap(({ id }) =>
        this.activitiesService.getById(id).pipe(
          map((activity) => loadActivitySuccess({ activity })),
          catchError((err: Error) =>
            of(loadActivityFailure({ error: err.message ?? 'Failed to load activity' })),
          ),
        ),
      ),
    ),
  );

  createActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createActivity),
      mergeMap(({ activity }) =>
        this.activitiesService.create(activity).pipe(
          map((created) => createActivitySuccess({ activity: created })),
          catchError((err: Error) =>
            of(createActivityFailure({ error: err.message ?? 'Failed to create activity' })),
          ),
        ),
      ),
    ),
  );

  createActivitySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createActivitySuccess),
        tap(() => this.notificationService.success('Activity created successfully')),
      ),
    { dispatch: false },
  );

  updateActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateActivity),
      mergeMap(({ activity }) =>
        this.activitiesService.update(activity).pipe(
          map((updated) => updateActivitySuccess({ activity: updated })),
          catchError((err: Error) =>
            of(updateActivityFailure({ error: err.message ?? 'Failed to update activity' })),
          ),
        ),
      ),
    ),
  );

  updateActivitySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateActivitySuccess),
        tap(() => this.notificationService.success('Activity updated successfully')),
      ),
    { dispatch: false },
  );

  deleteActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteActivity),
      mergeMap(({ id }) =>
        this.activitiesService.delete(id).pipe(
          map(() => deleteActivitySuccess({ id })),
          catchError((err: Error) =>
            of(deleteActivityFailure({ error: err.message ?? 'Failed to delete activity' })),
          ),
        ),
      ),
    ),
  );

  deleteActivitySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteActivitySuccess),
        tap(() => this.notificationService.success('Activity deleted successfully')),
      ),
    { dispatch: false },
  );

  mutationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          createActivityFailure,
          updateActivityFailure,
          deleteActivityFailure,
          loadActivitiesFailure,
        ),
        tap(({ error }) => this.notificationService.error(error)),
      ),
    { dispatch: false },
  );
}
