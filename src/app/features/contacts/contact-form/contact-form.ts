import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, map, startWith, take } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Company, Contact, ContactStatus, LeadSource } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { loadCompanies } from '../../../store/companies/companies.actions';
import { selectAllCompanies } from '../../../store/companies/companies.selectors';
import {
  createContact,
  createContactFailure,
  createContactSuccess,
  loadContact,
  loadContacts,
  updateContact,
  updateContactFailure,
  updateContactSuccess,
} from '../../../store/contacts/contacts.actions';
import { selectContactById } from '../../../store/contacts/contacts.selectors';
import { CONTACT_STATUS_LABELS, LEAD_SOURCE_LABELS } from '../contact-status.util';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly actions$ = inject(Actions);
  private readonly auth = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusLabels = CONTACT_STATUS_LABELS;
  readonly leadSourceLabels = LEAD_SOURCE_LABELS;

  readonly statusOptions: ContactStatus[] = [
    'active',
    'inactive',
    'prospect',
    'customer',
    'churned',
  ];
  readonly leadSourceOptions: LeadSource[] = [
    'website',
    'referral',
    'social',
    'email',
    'cold-call',
    'event',
    'other',
  ];

  isEditMode = false;
  contactId: string | null = null;
  submitted = false;
  saving = false;
  tags: string[] = [];
  addressExpanded = false;
  socialExpanded = false;
  tagInput = '';
  companyInput = '';

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    jobTitle: [''],
    companyId: [''],
    companyName: [''],
    status: ['prospect' as ContactStatus, Validators.required],
    leadSource: ['website' as LeadSource, Validators.required],
    notes: [''],
    owner: ['Alex Johnson', Validators.required],
    address: this.fb.nonNullable.group({
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zip: [''],
    }),
    socialLinks: this.fb.nonNullable.group({
      linkedin: [''],
      twitter: [''],
      website: [''],
    }),
  });

  readonly companies$ = this.store.select(selectAllCompanies);

  readonly filteredCompanies$ = combineLatest([
    this.companies$,
    this.form.controls.companyName.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([companies, query]) => {
      const q = (query ?? '').toLowerCase().trim();
      if (!q) {
        return companies.slice(0, 10);
      }
      return companies.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 10);
    }),
  );

  ngOnInit(): void {
    this.store.dispatch(loadCompanies());
    this.store.dispatch(loadContacts());

    const user = this.auth.getCurrentUser();
    user.pipe(take(1)).subscribe((u) => {
      if (u?.name) {
        this.form.patchValue({ owner: u.name });
      }
    });

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      const isNew = this.route.snapshot.url.some((s) => s.path === 'new');
      this.isEditMode = !!id && !isNew;
      this.contactId = id;

      if (this.isEditMode && id) {
        this.store.dispatch(loadContact({ id }));
        let patched = false;
        this.store
          .select(selectContactById(id))
          .pipe(
            filter((c): c is Contact => !!c),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe((contact) => {
            if (!patched) {
              this.patchForm(contact);
              patched = true;
            }
          });
      }
    });

    this.actions$
      .pipe(
        ofType(createContactSuccess, updateContactSuccess),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ contact }) => {
        this.saving = false;
        this.router.navigate(['/contacts', contact.id]);
      });

    this.actions$
      .pipe(
        ofType(createContactFailure, updateContactFailure),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.saving = false;
        this.cdr.markForCheck();
      });
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Contact' : 'New Contact';
  }

  displayCompany(company: Company | string): string {
    return typeof company === 'string' ? company : company.name;
  }

  onCompanyInputChange(value: string): void {
    this.companyInput = value;
  }

  onCompanySelected(company: Company): void {
    this.form.patchValue({
      companyId: company.id,
      companyName: company.name,
    });
  }

  addTagFromInput(value: string): void {
    const trimmed = (value ?? '').trim();
    if (trimmed && !this.tags.includes(trimmed)) {
      this.tags = [...this.tags, trimmed];
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const address = Object.values(raw.address).some(Boolean) ? raw.address : undefined;
    const socialLinks = Object.values(raw.socialLinks).some(Boolean)
      ? raw.socialLinks
      : undefined;

    const payload: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone || undefined,
      jobTitle: raw.jobTitle || undefined,
      companyId: raw.companyId || undefined,
      companyName: raw.companyName || undefined,
      status: raw.status,
      leadSource: raw.leadSource,
      notes: raw.notes || undefined,
      owner: raw.owner,
      tags: this.tags,
      address,
      socialLinks,
      dealIds: [],
      activityIds: [],
      avatar: undefined,
      lastContactedAt: undefined,
    };

    this.saving = true;

    if (this.isEditMode && this.contactId) {
      this.store
        .select(selectContactById(this.contactId))
        .pipe(take(1))
        .subscribe((existing) => {
          if (!existing) {
            this.saving = false;
            return;
          }
          this.store.dispatch(
            updateContact({
              contact: {
                ...existing,
                ...payload,
                dealIds: existing.dealIds,
                activityIds: existing.activityIds,
                avatar: existing.avatar,
                lastContactedAt: existing.lastContactedAt,
                tags: this.tags,
              },
            }),
          );
        });
    } else {
      this.store.dispatch(createContact({ contact: payload }));
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.contactId) {
      this.router.navigate(['/contacts', this.contactId]);
    } else {
      this.router.navigate(['/contacts']);
    }
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.hasError(error) && (control.touched || this.submitted));
  }

  private patchForm(contact: Contact): void {
    this.tags = [...contact.tags];
    this.form.patchValue({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone ?? '',
      jobTitle: contact.jobTitle ?? '',
      companyId: contact.companyId ?? '',
      companyName: contact.companyName ?? '',
      status: contact.status,
      leadSource: contact.leadSource,
      notes: contact.notes ?? '',
      owner: contact.owner,
      address: {
        street: contact.address?.street ?? '',
        city: contact.address?.city ?? '',
        state: contact.address?.state ?? '',
        country: contact.address?.country ?? '',
        zip: contact.address?.zip ?? '',
      },
      socialLinks: {
        linkedin: contact.socialLinks?.linkedin ?? '',
        twitter: contact.socialLinks?.twitter ?? '',
        website: contact.socialLinks?.website ?? '',
      },
    });
    this.cdr.markForCheck();
  }
}
