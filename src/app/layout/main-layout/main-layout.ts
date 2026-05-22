import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSidebarCollapsed } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  private readonly store = inject(Store);

  readonly sidebarCollapsed$ = this.store.select(selectSidebarCollapsed);
}
