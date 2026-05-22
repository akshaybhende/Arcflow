import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';

import { Contact, ContactStatus, LeadSource } from '../../../core/models';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import {
  ContactsFilter,
  ContactsSortField,
  deleteContact,
  loadContacts,
  setContactsFilter,
  setContactsPage,
  setContactsSort,
} from '../../../store/contacts/contacts.actions';
import {
  selectContactsFilter,
  selectContactsLoading,
  selectContactsPagination,
  selectContactsTotalCount,
  selectPaginatedContacts,
} from '../../../store/contacts/contacts.selectors';
import {
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_OPTIONS,
  LEAD_SOURCE_LABELS,
  LEAD_SOURCE_OPTIONS,
  contactStatusClass,
} from '../contact-status.util';

type ViewMode = 'table' | 'cards';

const SORT_COLUMN_MAP: Record<string, ContactsSortField> = {
  name: 'firstName',
  email: 'email',
  company: 'companyName',
  status: 'status',
  lastContacted: 'lastContactedAt',
};

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.html',
  styleUrl: './contacts-list.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchInput$ = new Subject<string>();

  readonly contacts$ = this.store.select(selectPaginatedContacts);
  readonly totalCount$ = this.store.select(selectContactsTotalCount);
  readonly loading$ = this.store.select(selectContactsLoading);
  readonly pagination$ = this.store.select(selectContactsPagination);
  readonly filter$ = this.store.select(selectContactsFilter);

  readonly statusOptions = CONTACT_STATUS_OPTIONS;
  readonly leadSourceOptions = LEAD_SOURCE_OPTIONS;
  readonly statusLabels = CONTACT_STATUS_LABELS;
  readonly leadSourceLabels = LEAD_SOURCE_LABELS;
  readonly contactStatusClass = contactStatusClass;

  viewMode: ViewMode = 'table';
  searchValue = '';
  statusFilter: ContactStatus | 'all' = 'all';
  leadSourceFilter: LeadSource | 'all' = 'all';

  readonly displayedColumns = [
    'name',
    'email',
    'company',
    'status',
    'leadSource',
    'lastContacted',
    'owner',
    'actions',
  ];

  ngOnInit(): void {
    this.store.dispatch(loadContacts());

    this.filter$.pipe(take(1)).subscribe((filter) => {
      this.searchValue = filter.search ?? '';
      this.statusFilter = filter.status ?? 'all';
      this.leadSourceFilter = filter.leadSource ?? 'all';
    });

    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((search) => this.patchFilter({ search: search || undefined }));

  }

  onSearchInput(value: string): void {
    this.searchValue = value;
    this.searchInput$.next(value);
  }

  onStatusFilterChange(status: ContactStatus | 'all'): void {
    this.statusFilter = status;
    this.patchFilter({ status: status === 'all' ? undefined : status });
  }

  onLeadSourceFilterChange(leadSource: LeadSource | 'all'): void {
    this.leadSourceFilter = leadSource;
    this.patchFilter({ leadSource: leadSource === 'all' ? undefined : leadSource });
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }
    const field = SORT_COLUMN_MAP[sort.active] ?? 'firstName';
    this.store.dispatch(
      setContactsSort({
        sort: { field, direction: sort.direction === 'asc' ? 'asc' : 'desc' },
      }),
    );
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      setContactsPage({ page: event.pageIndex + 1, pageSize: event.pageSize }),
    );
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  fullName(contact: Contact): string {
    return `${contact.firstName} ${contact.lastName}`.trim();
  }

  statusLabel(status: ContactStatus): string {
    return this.statusLabels[status];
  }

  leadSourceLabel(source: LeadSource): string {
    return this.leadSourceLabels[source];
  }

  onRowClick(contact: Contact, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.contacts-list__actions')) {
      return;
    }
    this.router.navigate(['/contacts', contact.id]);
  }

  onView(contact: Contact): void {
    this.router.navigate(['/contacts', contact.id]);
  }

  onEdit(contact: Contact): void {
    this.router.navigate(['/contacts', contact.id, 'edit']);
  }

  onAddContact(): void {
    this.router.navigate(['/contacts/new']);
  }

  onDelete(contact: Contact): void {
    const dialogRef = this.dialog.open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Delete contact',
        message: `Are you sure you want to delete ${this.fullName(contact)}? This action cannot be undone.`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(deleteContact({ id: contact.id }));
      }
    });
  }

  private patchFilter(partial: Partial<ContactsFilter>): void {
    this.store
      .select(selectContactsFilter)
      .pipe(take(1))
      .subscribe((current) => {
        this.store.dispatch(setContactsFilter({ filter: { ...current, ...partial } }));
      });
  }
}
