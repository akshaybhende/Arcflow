import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, switchMap, take } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { Activity, Contact, Deal } from '../../../core/models';
import { NotificationService } from '../../../core/services/notification.service';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import { loadActivities } from '../../../store/activities/activities.actions';
import { selectAllActivities } from '../../../store/activities/activities.selectors';
import { loadCompanies } from '../../../store/companies/companies.actions';
import { loadDeals } from '../../../store/deals/deals.actions';
import { selectAllDeals } from '../../../store/deals/deals.selectors';
import {
  deleteContact,
  loadContact,
  loadContacts,
  setSelectedContact,
  updateContact,
} from '../../../store/contacts/contacts.actions';
import { selectContactById, selectContactsLoading } from '../../../store/contacts/contacts.selectors';
import {
  CONTACT_STATUS_LABELS,
  LEAD_SOURCE_LABELS,
  contactStatusClass,
} from '../contact-status.util';

const ACTIVITY_ICONS: Record<string, string> = {
  call: 'call',
  email: 'email',
  meeting: 'groups',
  task: 'task_alt',
  note: 'sticky_note_2',
  'deal-update': 'trending_up',
  'contact-created': 'person_add',
};

const DEAL_STAGE_LABELS: Record<string, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactDetail implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly notesControl = new FormControl('');
  readonly loading$ = this.store.select(selectContactsLoading);
  readonly statusLabels = CONTACT_STATUS_LABELS;
  readonly leadSourceLabels = LEAD_SOURCE_LABELS;
  readonly contactStatusClass = contactStatusClass;
  readonly activityIcons = ACTIVITY_ICONS;
  readonly dealStageLabels = DEAL_STAGE_LABELS;

  readonly contact$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id') ?? '';
      this.store.dispatch(setSelectedContact({ id }));
      this.store.dispatch(loadContact({ id }));
      return this.store.select(selectContactById(id));
    }),
  );

  readonly deals$ = combineLatest([this.contact$, this.store.select(selectAllDeals)]).pipe(
    map(([contact, deals]) =>
      contact ? deals.filter((d) => d.contactId === contact.id) : [],
    ),
  );

  readonly activities$ = combineLatest([
    this.contact$,
    this.store.select(selectAllActivities),
  ]).pipe(
    map(([contact, activities]) => {
      if (!contact) {
        return [];
      }
      return activities
        .filter((a) => a.contactId === contact.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }),
  );

  ngOnInit(): void {
    this.store.dispatch(loadContacts());
    this.store.dispatch(loadDeals());
    this.store.dispatch(loadActivities());
    this.store.dispatch(loadCompanies());

    this.contact$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((contact) => {
      if (contact && this.notesControl.value !== (contact.notes ?? '')) {
        this.notesControl.setValue(contact.notes ?? '', { emitEvent: false });
      }
    });

    this.notesControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((notes) => {
        this.contact$.pipe(take(1), filter(Boolean)).subscribe((contact) => {
          if ((contact.notes ?? '') === (notes ?? '')) {
            return;
          }
          this.store.dispatch(updateContact({ contact: { ...contact, notes: notes ?? '' } }));
        });
      });
  }

  fullName(contact: Contact): string {
    return `${contact.firstName} ${contact.lastName}`.trim();
  }

  formatAddress(contact: Contact): string {
    const a = contact.address;
    if (!a) {
      return '';
    }
    return [a.street, a.city, a.state, a.zip, a.country].filter(Boolean).join(', ');
  }

  onEdit(contact: Contact): void {
    this.router.navigate(['/contacts', contact.id, 'edit']);
  }

  onDelete(contact: Contact): void {
    const dialogRef = this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Delete contact',
        message: `Are you sure you want to delete ${this.fullName(contact)}?`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(deleteContact({ id: contact.id }));
        this.router.navigate(['/contacts']);
      }
    });
  }

  onAddDeal(): void {
    this.notification.info('Create deal dialog coming soon');
  }

  onLogActivity(): void {
    this.notification.info('Log activity dialog coming soon');
  }

  onUploadFile(): void {
    this.notification.info('File uploads coming soon');
  }

  onBackToContacts(): void {
    this.router.navigate(['/contacts']);
  }

  dealStageClass(stage: Deal['stage']): string {
    return `deal-stage deal-stage--${stage}`;
  }

  activityIcon(type: Activity['type']): string {
    return ACTIVITY_ICONS[type] ?? 'event';
  }

  dealStageLabel(stage: Deal['stage']): string {
    return this.dealStageLabels[stage];
  }
}
