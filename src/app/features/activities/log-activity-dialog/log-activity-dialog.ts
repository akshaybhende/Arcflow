import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { formatISO } from 'date-fns';
import { Activity, ActivityStatus, ActivityType, Contact, Deal } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { ContactsService } from '../../../core/services/contacts.service';
import { DealsService } from '../../../core/services/deals.service';
import { createActivity, updateActivity } from '../../../store/activities/activities.actions';
import {
  ACTIVITY_TYPE_META,
  DUE_DATE_ACTIVITY_TYPES,
  LOGGABLE_ACTIVITY_TYPES,
} from '../activity.utils';

export interface LogActivityDialogData {
  activity?: Activity;
}

@Component({
  selector: 'app-log-activity-dialog',
  templateUrl: './log-activity-dialog.html',
  styleUrl: './log-activity-dialog.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogActivityDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<LogActivityDialog>);
  private readonly data = inject<LogActivityDialogData>(MAT_DIALOG_DATA);
  private readonly store = inject(Store);
  private readonly contactsService = inject(ContactsService);
  private readonly dealsService = inject(DealsService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly activityTypes = LOGGABLE_ACTIVITY_TYPES;
  readonly typeMeta = ACTIVITY_TYPE_META;
  readonly dueDateTypes = DUE_DATE_ACTIVITY_TYPES;

  contacts: Contact[] = [];
  deals: Deal[] = [];
  filteredContacts: Contact[] = [];
  filteredDeals: Deal[] = [];

  readonly form = this.fb.group({
    type: this.fb.nonNullable.control<ActivityType>('call', Validators.required),
    title: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.control(''),
    contactSearch: this.fb.control(''),
    contactId: this.fb.control<string | null>(null),
    dealSearch: this.fb.control(''),
    dealId: this.fb.control<string | null>(null),
    status: this.fb.nonNullable.control<ActivityStatus>('pending', Validators.required),
    dueDate: this.fb.control<Date | null>(null),
  });

  get isEdit(): boolean {
    return !!this.data.activity;
  }

  get dialogTitle(): string {
    return this.isEdit ? 'Edit Activity' : 'Log Activity';
  }

  get showDueDate(): boolean {
    return DUE_DATE_ACTIVITY_TYPES.includes(this.form.controls.type.value);
  }

  ngOnInit(): void {
    this.contactsService.getAll().subscribe((contacts) => {
      this.contacts = contacts;
      this.filteredContacts = contacts;
      this.cdr.markForCheck();
    });

    this.dealsService.getAll().subscribe((deals) => {
      this.deals = deals;
      this.filterDealsByContact(this.form.controls.contactId.value);
      this.cdr.markForCheck();
    });

    if (this.data.activity) {
      const activity = this.data.activity;
      this.form.patchValue({
        type: LOGGABLE_ACTIVITY_TYPES.includes(activity.type as ActivityType)
          ? (activity.type as ActivityType)
          : 'call',
        title: activity.title,
        description: activity.description ?? '',
        contactSearch: activity.contactName ?? '',
        contactId: activity.contactId ?? null,
        dealSearch: activity.dealName ?? '',
        dealId: activity.dealId ?? null,
        status: activity.status === 'cancelled' ? 'pending' : activity.status,
        dueDate: activity.dueDate ? new Date(activity.dueDate) : null,
      });
    }

    this.form.controls.contactSearch.valueChanges.subscribe((value) => {
      const q = (value ?? '').toLowerCase();
      this.filteredContacts = this.contacts.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q),
      );
      this.cdr.markForCheck();
    });

    this.form.controls.dealSearch.valueChanges.subscribe((value) => {
      const q = (value ?? '').toLowerCase();
      this.filteredDeals = this.deals.filter((d) => d.title.toLowerCase().includes(q));
      this.cdr.markForCheck();
    });
  }

  displayContact = (contact: Contact | null): string => {
    if (!contact) {
      return '';
    }
    return `${contact.firstName} ${contact.lastName}`;
  };

  displayDeal = (deal: Deal | null): string => {
    return deal?.title ?? '';
  };

  onContactSelected(contact: Contact): void {
    this.form.patchValue({
      contactId: contact.id,
      contactSearch: `${contact.firstName} ${contact.lastName}`,
    });
    this.form.controls.dealSearch.setValue('');
    this.form.controls.dealId.setValue(null);
    this.filterDealsByContact(contact.id);
    this.cdr.markForCheck();
  }

  onDealSelected(deal: Deal): void {
    this.form.patchValue({
      dealId: deal.id,
      dealSearch: deal.title,
    });
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const contact = this.contacts.find((c) => c.id === raw.contactId);
    const deal = this.deals.find((d) => d.id === raw.dealId);
    const owner = this.authService.currentUser?.name ?? 'Alex Johnson';
    const dueDate =
      this.showDueDate && raw.dueDate
        ? formatISO(raw.dueDate, { representation: 'complete' })
        : undefined;

    if (this.isEdit && this.data.activity) {
      const updated: Activity = {
        ...this.data.activity,
        type: raw.type,
        title: raw.title.trim(),
        description: raw.description?.trim() || undefined,
        contactId: contact?.id,
        contactName: contact ? `${contact.firstName} ${contact.lastName}` : undefined,
        dealId: deal?.id,
        dealName: deal?.title,
        companyId: contact?.companyId,
        status: raw.status,
        dueDate,
        completedAt:
          raw.status === 'completed'
            ? (this.data.activity.completedAt ?? formatISO(new Date()))
            : undefined,
        updatedAt: formatISO(new Date()),
      };
      this.store.dispatch(updateActivity({ activity: updated }));
    } else {
      this.store.dispatch(
        createActivity({
          activity: {
            type: raw.type,
            title: raw.title.trim(),
            description: raw.description?.trim() || undefined,
            contactId: contact?.id,
            contactName: contact ? `${contact.firstName} ${contact.lastName}` : undefined,
            dealId: deal?.id,
            dealName: deal?.title,
            companyId: contact?.companyId,
            status: raw.status,
            dueDate,
            completedAt: raw.status === 'completed' ? formatISO(new Date()) : undefined,
            owner,
          },
        }),
      );
    }

    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private filterDealsByContact(contactId: string | null): void {
    if (!contactId) {
      this.filteredDeals = [...this.deals];
      return;
    }
    this.filteredDeals = this.deals.filter((d) => d.contactId === contactId);
  }
}
