import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Company, CompanyIndustry, CompanySize } from '../../../core/models';
import { loadCompanies, setCompaniesFilter } from '../../../store/companies/companies.actions';
import {
  selectCompaniesLoading,
  selectCompaniesTotalCount,
  selectFilteredCompanies,
} from '../../../store/companies/companies.selectors';
import { INDUSTRIES, INDUSTRY_LABELS, SIZE_LABELS, SIZES } from '../companies.constants';

type ViewMode = 'table' | 'cards';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.html',
  styleUrl: './companies-list.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly industryLabels = INDUSTRY_LABELS;
  readonly sizeLabels = SIZE_LABELS;
  readonly industries = INDUSTRIES;
  readonly sizes = SIZES;

  readonly companies$ = this.store.select(selectFilteredCompanies);
  readonly totalCount$ = this.store.select(selectCompaniesTotalCount);
  readonly loading$ = this.store.select(selectCompaniesLoading);

  viewMode: ViewMode = 'table';
  searchControl = new FormControl('', { nonNullable: true });
  industryFilter = new FormControl<CompanyIndustry | 'all'>('all', { nonNullable: true });
  sizeFilter = new FormControl<CompanySize | 'all'>('all', { nonNullable: true });

  readonly tableColumns = [
    'name',
    'industry',
    'size',
    'contacts',
    'deals',
    'revenue',
    'owner',
    'actions',
  ];
  dataSource = new MatTableDataSource<Company>([]);

  ngOnInit(): void {
    this.store.dispatch(loadCompanies());

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());

    this.industryFilter.valueChanges.subscribe(() => this.applyFilters());
    this.sizeFilter.valueChanges.subscribe(() => this.applyFilters());

    this.companies$.subscribe((companies) => {
      this.dataSource.data = companies;
      this.cdr.markForCheck();
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.cdr.markForCheck();
  }

  applyFilters(): void {
    const industry = this.industryFilter.value;
    const size = this.sizeFilter.value;
    this.store.dispatch(
      setCompaniesFilter({
        filter: {
          search: this.searchControl.value.trim() || undefined,
          industry: industry === 'all' ? undefined : industry,
          size: size === 'all' ? undefined : size,
        },
      }),
    );
  }

  navigateToCompany(id: string): void {
    void this.router.navigate(['/companies', id]);
  }

  navigateToNew(): void {
    void this.router.navigate(['/companies/new']);
  }

  navigateToEdit(id: string, event: Event): void {
    event.stopPropagation();
    void this.router.navigate(['/companies', id, 'edit']);
  }

  industryLabel(industry: CompanyIndustry): string {
    return INDUSTRY_LABELS[industry];
  }

  sizeLabel(size: CompanySize): string {
    return SIZE_LABELS[size];
  }
}
