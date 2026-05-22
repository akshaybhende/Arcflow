import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Deal, DealStage } from '../../core/models';
import { loadDeals, setDealsFilter, updateDeal } from '../../store/deals/deals.actions';
import {
  DEAL_STAGES,
  selectDealsByStage,
  selectDealsLoading,
  selectFilteredDeals,
  selectPipelineValue,
} from '../../store/deals/deals.selectors';
import { PRIORITY_COLORS, STAGE_COLORS, STAGE_LABELS } from './deals.constants';

type ViewMode = 'kanban' | 'list';

@Component({
  selector: 'app-deals-page',
  templateUrl: './deals.html',
  styleUrl: './deals.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealsPage implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly stages = DEAL_STAGES;
  readonly stageLabels = STAGE_LABELS;
  readonly stageColors = STAGE_COLORS;
  readonly priorityColors = PRIORITY_COLORS;

  readonly dealsByStage$ = this.store.select(selectDealsByStage);
  readonly pipelineValue$ = this.store.select(selectPipelineValue);
  readonly loading$ = this.store.select(selectDealsLoading);
  readonly filteredDeals$ = this.store.select(selectFilteredDeals);

  viewMode: ViewMode = 'kanban';
  searchControl = new FormControl('', { nonNullable: true });
  stageFilter = new FormControl<DealStage | 'all'>('all', { nonNullable: true });
  ownerFilter = new FormControl<string>('all', { nonNullable: true });

  readonly listColumns = [
    'title',
    'contact',
    'company',
    'stage',
    'value',
    'priority',
    'closeDate',
    'owner',
    'actions',
  ];
  dataSource = new MatTableDataSource<Deal>([]);

  readonly owners$ = this.filteredDeals$.pipe(
    map((deals) => ['all', ...new Set(deals.map((d) => d.owner))]),
    startWith(['all']),
  );

  ngOnInit(): void {
    this.store.dispatch(loadDeals());

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => this.applyFilters());

    this.stageFilter.valueChanges.subscribe(() => this.applyFilters());
    this.ownerFilter.valueChanges.subscribe(() => this.applyFilters());

    this.filteredDeals$.subscribe((deals) => {
      this.dataSource.data = deals;
      this.cdr.markForCheck();
    });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.cdr.markForCheck();
  }

  applyFilters(): void {
    const stage = this.stageFilter.value;
    const owner = this.ownerFilter.value;
    this.store.dispatch(
      setDealsFilter({
        filter: {
          search: this.searchControl.value.trim() || undefined,
          stage: stage === 'all' ? undefined : stage,
          owner: owner === 'all' ? undefined : owner,
        },
      }),
    );
  }

  columnTotal(deals: Deal[]): number {
    return deals.reduce((sum, d) => sum + d.value, 0);
  }

  isOverdue(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }

  formatCloseDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  onDrop(event: CdkDragDrop<Deal[]>, targetStage: DealStage): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const deal = event.item.data as Deal;
    if (deal.stage !== targetStage) {
      this.store.dispatch(
        updateDeal({
          deal: { ...deal, stage: targetStage, updatedAt: new Date().toISOString() },
        }),
      );
    }
  }

  navigateToDeal(id: string): void {
    void this.router.navigate(['/deals', id]);
  }

  navigateToNew(): void {
    void this.router.navigate(['/deals/new']);
  }

  navigateToEdit(id: string, event: Event): void {
    event.stopPropagation();
    void this.router.navigate(['/deals', id, 'edit']);
  }

  stageLabel(stage: DealStage): string {
    return STAGE_LABELS[stage];
  }

  stageColor(stage: DealStage): string {
    return STAGE_COLORS[stage];
  }

  priorityColor(priority: Deal['priority']): string {
    return PRIORITY_COLORS[priority];
  }
}
