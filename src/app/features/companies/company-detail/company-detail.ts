import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, filter, map, switchMap, takeUntil } from 'rxjs';
import { Activity, Company, Contact, Deal } from '../../../core/models';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { loadActivities } from '../../../store/activities/activities.actions';
import { selectAllActivities } from '../../../store/activities/activities.selectors';
import { deleteCompany, loadCompany, loadCompanies } from '../../../store/companies/companies.actions';
import { selectCompanyById } from '../../../store/companies/companies.selectors';
import { loadContacts } from '../../../store/contacts/contacts.actions';
import { selectAllContacts } from '../../../store/contacts/contacts.selectors';
import { loadDeals } from '../../../store/deals/deals.actions';
import { selectAllDeals } from '../../../store/deals/deals.selectors';
import { INDUSTRY_LABELS, SIZE_LABELS } from '../companies.constants';
import { STAGE_COLORS, STAGE_LABELS } from '../../deals/deals.constants';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.html',
  styleUrl: './company-detail.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetail implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  readonly industryLabels = INDUSTRY_LABELS;
  readonly sizeLabels = SIZE_LABELS;
  readonly stageLabels = STAGE_LABELS;
  readonly stageColors = STAGE_COLORS;

  activeTab = 'Overview';
  company: Company | null = null;
  contacts: Contact[] = [];
  deals: Deal[] = [];
  activities: Activity[] = [];

  ngOnInit(): void {
    this.store.dispatch(loadCompanies());
    this.store.dispatch(loadContacts());
    this.store.dispatch(loadDeals());
    this.store.dispatch(loadActivities());

    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        filter((id) => !!id),
        takeUntil(this.destroy$),
      )
      .subscribe((id) => {
        this.store.dispatch(loadCompany({ id }));
      });

    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        filter((id) => !!id),
        switchMap((id) =>
          combineLatest([
            this.store.select(selectCompanyById(id)),
            this.store.select(selectAllContacts),
            this.store.select(selectAllDeals),
            this.store.select(selectAllActivities),
          ]).pipe(
            map(([company, allContacts, allDeals, allActivities]) => {
              if (!company) {
                return { company: null, contacts: [], deals: [], activities: [] };
              }
              const contacts = allContacts.filter((c) => company.contactIds.includes(c.id));
              const deals = allDeals.filter(
                (d) =>
                  company.dealIds.includes(d.id) ||
                  d.companyName?.toLowerCase() === company.name.toLowerCase(),
              );
              const activities = allActivities
                .filter(
                  (a) =>
                    a.companyId === company.id ||
                    contacts.some((c) => c.id === a.contactId) ||
                    deals.some((d) => d.id === a.dealId),
                )
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              return { company, contacts, deals, activities };
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((data) => {
        this.company = data.company;
        this.contacts = data.contacts;
        this.deals = data.deals;
        this.activities = data.activities;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToEdit(): void {
    if (this.company) {
      void this.router.navigate(['/companies', this.company.id, 'edit']);
    }
  }

  confirmDelete(): void {
    if (!this.company) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete company',
        message: `Are you sure you want to delete "${this.company.name}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.company) {
        this.store.dispatch(deleteCompany({ id: this.company.id }));
        void this.router.navigate(['/companies']);
      }
    });
  }

  formatAddress(company: Company): string {
    const addr = company.address;
    if (!addr) {
      return '';
    }
    return [addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(', ');
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
}
