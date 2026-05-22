import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, filter, map, startWith, take, takeUntil } from 'rxjs';
import { Contact, Deal, DealPriority, DealStage } from '../../../core/models';
import { loadContacts } from '../../../store/contacts/contacts.actions';
import { selectAllContacts } from '../../../store/contacts/contacts.selectors';
import { createDeal, loadDeal, updateDeal } from '../../../store/deals/deals.actions';
import { selectDealById } from '../../../store/deals/deals.selectors';
import { DEAL_STAGES } from '../../../store/deals/deals.selectors';
import { STAGE_LABELS } from '../deals.constants';

@Component({
  selector: 'app-deal-form',
  templateUrl: './deal-form.html',
  styleUrl: './deal-form.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealForm implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly stages = DEAL_STAGES;
  readonly stageLabels = STAGE_LABELS;
  readonly priorities: DealPriority[] = ['low', 'medium', 'high'];

  isEditMode = false;
  dealId: string | null = null;
  saving = false;
  submitted = false;

  contacts$ = this.store.select(selectAllContacts);
  filteredContacts$!: Observable<Contact[]>;

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    contactId: ['', Validators.required],
    contactName: [''],
    companyName: [''],
    stage: ['lead' as DealStage, Validators.required],
    value: [0, [Validators.required, Validators.min(0)]],
    priority: ['medium' as DealPriority, Validators.required],
    probability: [50, [Validators.min(0), Validators.max(100)]],
    expectedCloseDate: [new Date(), Validators.required],
    tags: [''],
    notes: [''],
    owner: ['Alex Johnson', Validators.required],
    currency: ['USD'],
    activityIds: [[] as string[]],
  });

  ngOnInit(): void {
    this.store.dispatch(loadContacts());

    this.filteredContacts$ = combineLatest([
      this.contacts$,
      this.form.controls.contactName.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([contacts, query]) => {
        const q = (query ?? '').toLowerCase();
        if (!q) {
          return contacts.slice(0, 10);
        }
        return contacts.filter((c) => {
          const name = `${c.firstName} ${c.lastName}`.toLowerCase();
          return name.includes(q) || c.email.toLowerCase().includes(q);
        });
      }),
    );

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      this.isEditMode = !!id && this.route.snapshot.url.some((s) => s.path === 'edit');
      this.dealId = this.isEditMode && id ? id : null;

      if (this.isEditMode && this.dealId) {
        this.store.dispatch(loadDeal({ id: this.dealId }));
        this.store
          .select(selectDealById(this.dealId))
          .pipe(takeUntil(this.destroy$))
          .subscribe((deal) => {
            if (deal) {
              this.patchForm(deal);
            }
          });
      } else {
        this.applyQueryParamContact();
      }
    });
  }

  private applyQueryParamContact(): void {
    const contactId = this.route.snapshot.queryParamMap.get('contactId');
    if (!contactId) {
      return;
    }

    const contactName = this.route.snapshot.queryParamMap.get('contactName') ?? '';
    const companyName = this.route.snapshot.queryParamMap.get('companyName') ?? '';

    this.contacts$
      .pipe(
        filter((contacts) => contacts.length > 0),
        take(1),
        takeUntil(this.destroy$),
      )
      .subscribe((contacts) => {
        const contact = contacts.find((c) => c.id === contactId);
        if (contact) {
          this.onContactSelected(contact);
          return;
        }
        this.form.patchValue({
          contactId,
          contactName,
          companyName,
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  displayContact(contact: Contact): string {
    return `${contact.firstName} ${contact.lastName}`;
  }

  onContactSelected(contact: Contact): void {
    this.form.patchValue({
      contactId: contact.id,
      contactName: `${contact.firstName} ${contact.lastName}`,
      companyName: contact.companyName ?? '',
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const raw = this.form.getRawValue();
    const tags = raw.tags
      ? raw.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const payload = {
      title: raw.title,
      contactId: raw.contactId,
      contactName: raw.contactName,
      companyName: raw.companyName || undefined,
      stage: raw.stage,
      value: Number(raw.value),
      currency: raw.currency,
      priority: raw.priority,
      probability: Number(raw.probability),
      expectedCloseDate: new Date(raw.expectedCloseDate).toISOString(),
      owner: raw.owner,
      tags,
      notes: raw.notes || undefined,
      activityIds: raw.activityIds,
    };

    this.saving = true;

    if (this.isEditMode && this.dealId) {
      this.store
        .select(selectDealById(this.dealId))
        .pipe(takeUntil(this.destroy$))
        .subscribe((existing) => {
          if (existing) {
            this.store.dispatch(
              updateDeal({
                deal: {
                  ...existing,
                  ...payload,
                  updatedAt: new Date().toISOString(),
                },
              }),
            );
            void this.router.navigate(['/deals', existing.id]);
          }
          this.saving = false;
        });
    } else {
      this.store.dispatch(createDeal({ deal: payload }));
      void this.router.navigate(['/deals']);
      this.saving = false;
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.dealId) {
      void this.router.navigate(['/deals', this.dealId]);
    } else {
      void this.router.navigate(['/deals']);
    }
  }

  private patchForm(deal: Deal): void {
    this.form.patchValue({
      title: deal.title,
      contactId: deal.contactId,
      contactName: deal.contactName,
      companyName: deal.companyName ?? '',
      stage: deal.stage,
      value: deal.value,
      priority: deal.priority,
      probability: deal.probability,
      expectedCloseDate: new Date(deal.expectedCloseDate),
      tags: deal.tags.join(', '),
      notes: deal.notes ?? '',
      owner: deal.owner,
      currency: deal.currency,
      activityIds: deal.activityIds,
    });
  }
}
