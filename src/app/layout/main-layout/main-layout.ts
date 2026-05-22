import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { map, shareReplay } from 'rxjs/operators';

import { setMobileSidebarOpen, toggleMobileSidebar } from '../../store/ui/ui.actions';
import { selectMobileSidebarOpen } from '../../store/ui/ui.selectors';

const HANDSET_QUERY = '(max-width: 768px)';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  private readonly store = inject(Store);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly mobileSidebarOpen$ = this.store.select(selectMobileSidebarOpen);

  readonly isHandset$ = this.breakpointObserver.observe(HANDSET_QUERY).pipe(
    map((state) => state.matches),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor() {
    this.isHandset$.pipe(takeUntilDestroyed()).subscribe((handset) => {
      if (!handset) {
        this.store.dispatch(setMobileSidebarOpen({ open: false }));
      }
    });
  }

  onMenuToggle(): void {
    this.store.dispatch(toggleMobileSidebar());
  }

  onSidebarNavigate(): void {
    this.store.dispatch(setMobileSidebarOpen({ open: false }));
  }

  onSidenavClosed(): void {
    this.store.dispatch(setMobileSidebarOpen({ open: false }));
  }
}
