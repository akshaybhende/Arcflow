import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Company, CompanyIndustry, CompanySize } from '../../../core/models';
import { createCompany, loadCompany, updateCompany } from '../../../store/companies/companies.actions';
import { selectCompanyById } from '../../../store/companies/companies.selectors';
import { INDUSTRIES, INDUSTRY_LABELS, SIZES, SIZE_LABELS } from '../companies.constants';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.html',
  styleUrl: './company-form.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyForm implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly industries = INDUSTRIES;
  readonly sizes = SIZES;
  readonly industryLabels = INDUSTRY_LABELS;
  readonly sizeLabels = SIZE_LABELS;

  isEditMode = false;
  companyId: string | null = null;
  saving = false;
  submitted = false;
  addressExpanded = false;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    industry: ['technology' as CompanyIndustry, Validators.required],
    size: ['11-50' as CompanySize, Validators.required],
    website: [''],
    phone: [''],
    email: [''],
    revenue: [null as number | null],
    street: [''],
    city: [''],
    state: [''],
    country: [''],
    zip: [''],
    notes: [''],
    owner: ['Alex Johnson', Validators.required],
    domain: [''],
    contactIds: [[] as string[]],
    dealIds: [[] as string[]],
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      this.isEditMode = !!id && this.route.snapshot.url.some((s) => s.path === 'edit');
      this.companyId = this.isEditMode && id ? id : null;

      if (this.isEditMode && this.companyId) {
        this.store.dispatch(loadCompany({ id: this.companyId }));
        this.store
          .select(selectCompanyById(this.companyId))
          .pipe(takeUntil(this.destroy$))
          .subscribe((company) => {
            if (company) {
              this.patchForm(company);
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const raw = this.form.getRawValue();
    const hasAddress = raw.street || raw.city || raw.state || raw.country || raw.zip;

    const payload = {
      name: raw.name,
      industry: raw.industry,
      size: raw.size,
      website: raw.website || undefined,
      phone: raw.phone || undefined,
      email: raw.email || undefined,
      revenue: raw.revenue ?? undefined,
      domain: raw.domain || undefined,
      notes: raw.notes || undefined,
      owner: raw.owner,
      contactIds: raw.contactIds,
      dealIds: raw.dealIds,
      address: hasAddress
        ? {
            street: raw.street || undefined,
            city: raw.city || undefined,
            state: raw.state || undefined,
            country: raw.country || undefined,
            zip: raw.zip || undefined,
          }
        : undefined,
    };

    this.saving = true;

    if (this.isEditMode && this.companyId) {
      this.store
        .select(selectCompanyById(this.companyId))
        .pipe(takeUntil(this.destroy$))
        .subscribe((existing) => {
          if (existing) {
            this.store.dispatch(
              updateCompany({
                company: {
                  ...existing,
                  ...payload,
                  updatedAt: new Date().toISOString(),
                },
              }),
            );
            void this.router.navigate(['/companies', existing.id]);
          }
          this.saving = false;
        });
    } else {
      this.store.dispatch(createCompany({ company: payload }));
      void this.router.navigate(['/companies']);
      this.saving = false;
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.companyId) {
      void this.router.navigate(['/companies', this.companyId]);
    } else {
      void this.router.navigate(['/companies']);
    }
  }

  private patchForm(company: Company): void {
    this.form.patchValue({
      name: company.name,
      industry: company.industry,
      size: company.size,
      website: company.website ?? '',
      phone: company.phone ?? '',
      email: company.email ?? '',
      revenue: company.revenue ?? null,
      domain: company.domain ?? '',
      notes: company.notes ?? '',
      owner: company.owner,
      contactIds: company.contactIds,
      dealIds: company.dealIds,
      street: company.address?.street ?? '',
      city: company.address?.city ?? '',
      state: company.address?.state ?? '',
      country: company.address?.country ?? '',
      zip: company.address?.zip ?? '',
    });
  }
}
