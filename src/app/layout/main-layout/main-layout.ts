import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

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
export class MainLayout implements OnInit {
  private readonly store = inject(Store);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  readonly mobileSidebarOpen$: Observable<boolean>;
  readonly isHandset$: Observable<boolean>;

  constructor() {
    this.mobileSidebarOpen$ = this.store.select(selectMobileSidebarOpen);
    this.isHandset$ = this.breakpointObserver.observe(HANDSET_QUERY).pipe(
      map((state) => state.matches),
      startWith(false),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  ngOnInit(): void {
    this.isHandset$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((handset) => {
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
