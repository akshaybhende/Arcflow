import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest, filter, map, of, switchMap, takeUntil } from 'rxjs';
import { Activity, Contact, Deal } from '../../../core/models';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { loadActivities } from '../../../store/activities/activities.actions';
import { selectAllActivities } from '../../../store/activities/activities.selectors';
import { loadContacts } from '../../../store/contacts/contacts.actions';
import { selectContactById } from '../../../store/contacts/contacts.selectors';
import { deleteDeal, loadDeal, loadDeals, updateDeal } from '../../../store/deals/deals.actions';
import { selectDealById } from '../../../store/deals/deals.selectors';
import { STAGE_COLORS, STAGE_LABELS } from '../deals.constants';

@Component({
  selector: 'app-deal-detail',
  templateUrl: './deal-detail.html',
  styleUrl: './deal-detail.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealDetail implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  readonly stageLabels = STAGE_LABELS;
  readonly stageColors = STAGE_COLORS;

  activeTab = 'Overview';
  deal: Deal | null = null;
  contact: Contact | null = null;
  activities: Activity[] = [];
  historyEntries: { label: string; date: string }[] = [];

  ngOnInit(): void {
    this.store.dispatch(loadDeals());
    this.store.dispatch(loadContacts());
    this.store.dispatch(loadActivities());

    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        filter((id) => !!id),
        takeUntil(this.destroy$),
      )
      .subscribe((id) => {
        this.store.dispatch(loadDeal({ id }));
      });

    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        filter((id) => !!id),
        switchMap((id) =>
          combineLatest([
            this.store.select(selectDealById(id)),
            this.store.select(selectAllActivities),
          ]).pipe(
            switchMap(([deal, allActivities]) => {
              if (!deal) {
                return of({ deal: null, contact: null, activities: [] as Activity[] });
              }
              return combineLatest([
                this.store.select(selectContactById(deal.contactId)),
              ]).pipe(
                map(([contact]) => ({
                  deal,
                  contact,
                  activities: allActivities
                    .filter((a) => a.dealId === deal.id || deal.activityIds.includes(a.id))
                    .sort(
                      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                    ),
                })),
              );
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(({ deal, contact, activities }) => {
        this.deal = deal;
        this.contact = contact;
        this.activities = activities;
        if (deal) {
          this.historyEntries = this.buildHistory(deal);
        }
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatProbability(value: number): string {
    return `${value}%`;
  }

  onProbabilityChange(value: number): void {
    if (!this.deal || this.deal.probability === value) {
      return;
    }
    this.store.dispatch(
      updateDeal({
        deal: { ...this.deal, probability: value, updatedAt: new Date().toISOString() },
      }),
    );
  }

  navigateToEdit(): void {
    if (this.deal) {
      void this.router.navigate(['/deals', this.deal.id, 'edit']);
    }
  }

  confirmDelete(): void {
    if (!this.deal) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete deal',
        message: `Are you sure you want to delete "${this.deal.title}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.deal) {
        this.store.dispatch(deleteDeal({ id: this.deal.id }));
        void this.router.navigate(['/deals']);
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  activityIcon(type: Activity['type']): string {
    const icons: Record<Activity['type'], string> = {
      call: 'call',
      email: 'email',
      meeting: 'groups',
      task: 'task_alt',
      note: 'sticky_note_2',
      'deal-update': 'handshake',
      'contact-created': 'person_add',
    };
    return icons[type] ?? 'event';
  }

  private buildHistory(deal: Deal): { label: string; date: string }[] {
    return [
      { label: `Created in ${STAGE_LABELS.lead}`, date: deal.createdAt },
      { label: `Currently in ${STAGE_LABELS[deal.stage]}`, date: deal.updatedAt },
      {
        label: `Expected close ${this.formatDate(deal.expectedCloseDate)}`,
        date: deal.expectedCloseDate,
      },
    ];
  }
}
