import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MOCK_USERS } from '../../mock/mock-data';
import { trackByRoute } from '../../shared/utils/track-by';
import { toggleSidebar } from '../../store/ui/ui.actions';
import { selectSidebarCollapsed } from '../../store/ui/ui.selectors';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: Observable<number | null>;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private readonly store = inject(Store);

  @Output() readonly navigate = new EventEmitter<void>();

  readonly collapsed$: Observable<boolean>;
  readonly currentUser = MOCK_USERS[0];
  readonly trackByRoute = trackByRoute;

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Contacts', icon: 'people', route: '/contacts' },
    { label: 'Deals', icon: 'handshake', route: '/deals' },
    { label: 'Companies', icon: 'business', route: '/companies' },
    { label: 'Activities', icon: 'event_note', route: '/activities' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  constructor() {
    this.collapsed$ = this.store.select(selectSidebarCollapsed);
  }

  onToggleCollapse(): void {
    this.store.dispatch(toggleSidebar());
  }

  onNavClick(): void {
    this.navigate.emit();
  }
}
