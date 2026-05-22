import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { formatISO, isBefore, startOfDay } from 'date-fns';
import { combineLatest, filter, map, take } from 'rxjs';
import { Activity, ActivityStatus, ActivityType } from '../../../core/models';
import { ConfirmDialog, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog';
import {
  deleteActivity,
  loadActivities,
  setActivitiesFilter,
  setSelectedActivity,
  updateActivity,
} from '../../../store/activities/activities.actions';
import {
  selectActivitiesLoading,
  selectFilteredActivities,
  selectSelectedActivity,
} from '../../../store/activities/activities.selectors';
import { ACTIVITY_TYPE_META } from '../activity.utils';
import { LogActivityDialog, LogActivityDialogData } from '../log-activity-dialog/log-activity-dialog';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.html',
  styleUrl: './activities-list.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesList implements OnInit {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  readonly typeMeta = ACTIVITY_TYPE_META;
  readonly typeOptions: { value: ActivityType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'call', label: 'Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'task', label: 'Task' },
    { value: 'note', label: 'Note' },
  ];
  readonly statusOptions: { value: ActivityStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  readonly filterForm = this.fb.group({
    type: this.fb.nonNullable.control<ActivityType | 'all'>('all'),
    status: this.fb.nonNullable.control<ActivityStatus | 'all'>('all'),
    dateFrom: this.fb.control<Date | null>(null),
    dateTo: this.fb.control<Date | null>(null),
  });

  readonly activities$ = this.store.select(selectFilteredActivities);
  readonly selectedActivity$ = this.store.select(selectSelectedActivity);
  readonly loading$ = this.store.select(selectActivitiesLoading);

  readonly vm$ = combineLatest([this.activities$, this.selectedActivity$, this.loading$]).pipe(
    map(([activities, selected, loading]) => ({ activities, selected, loading })),
  );

  ngOnInit(): void {
    this.store.dispatch(loadActivities());
    this.applyFilters();

    this.filterForm.valueChanges.subscribe(() => this.applyFilters());

    combineLatest([this.activities$, this.store.select(selectSelectedActivity)])
      .pipe(
        filter(([activities, selected]) => activities.length > 0 && !selected),
        take(1),
      )
      .subscribe(([activities]) => {
        this.store.dispatch(setSelectedActivity({ id: activities[0].id }));
      });
  }

  selectActivity(activity: Activity): void {
    this.store.dispatch(setSelectedActivity({ id: activity.id }));
  }

  isSelected(activity: Activity, selected: Activity | null): boolean {
    return selected?.id === activity.id;
  }

  isOverdue(activity: Activity): boolean {
    if (activity.status !== 'pending' || !activity.dueDate) {
      return false;
    }
    return isBefore(new Date(activity.dueDate), startOfDay(new Date()));
  }

  statusLabel(status: ActivityStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  statusClass(status: ActivityStatus): string {
    return `activities-list__status--${status}`;
  }

  truncate(text: string | undefined, max = 80): string {
    if (!text) {
      return '';
    }
    return text.length > max ? `${text.slice(0, max)}…` : text;
  }

  formatDueDate(iso?: string): string {
    if (!iso) {
      return '—';
    }
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  openLogDialog(activity?: Activity): void {
    const ref = this.dialog.open(LogActivityDialog, {
      width: '520px',
      data: { activity } satisfies LogActivityDialogData,
    });

    ref.afterClosed().subscribe((saved) => {
      if (saved && activity) {
        this.store.dispatch(setSelectedActivity({ id: activity.id }));
      }
    });
  }

  markComplete(activity: Activity, event: Event): void {
    event.stopPropagation();
    const updated: Activity = {
      ...activity,
      status: 'completed',
      completedAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    };
    this.store.dispatch(updateActivity({ activity: updated }));
  }

  deleteActivity(activity: Activity): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Delete Activity',
        message: `Are you sure you want to delete "${activity.title}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        destructive: true,
      } satisfies ConfirmDialogData,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(deleteActivity({ id: activity.id }));
        this.store.dispatch(setSelectedActivity({ id: null }));
      }
    });
  }

  private applyFilters(): void {
    const raw = this.filterForm.getRawValue();
    this.store.dispatch(
      setActivitiesFilter({
        filter: {
          type: raw.type,
          status: raw.status,
          dateFrom: raw.dateFrom ? formatISO(raw.dateFrom, { representation: 'date' }) : undefined,
          dateTo: raw.dateTo ? formatISO(raw.dateTo, { representation: 'date' }) : undefined,
        },
      }),
    );
  }
}
