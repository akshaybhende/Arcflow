import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MOCK_USERS } from '../../mock/mock-data';
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

  readonly collapsed$ = this.store.select(selectSidebarCollapsed);
  readonly currentUser = MOCK_USERS[0];

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Contacts', icon: 'people', route: '/contacts' },
    { label: 'Deals', icon: 'handshake', route: '/deals' },
    { label: 'Companies', icon: 'business', route: '/companies' },
    { label: 'Activities', icon: 'event_note', route: '/activities' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  onToggleCollapse(): void {
    this.store.dispatch(toggleSidebar());
  }
}
