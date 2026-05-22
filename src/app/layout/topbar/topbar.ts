import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { User } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import {
  selectGlobalLoading,
  selectTheme,
  selectUnreadNotificationCount,
} from '../../store/ui/ui.selectors';

const ROUTE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  contacts: 'Contacts',
  deals: 'Deals',
  companies: 'Companies',
  activities: 'Activities',
  settings: 'Settings',
};

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  @Input() showMenu = false;
  @Output() readonly menuToggle = new EventEmitter<void>();

  readonly currentUser$: Observable<User | null>;
  readonly globalLoading$: Observable<boolean>;
  readonly theme$: Observable<'light' | 'dark'>;
  readonly unreadCount$: Observable<number>;
  readonly pageTitle$: Observable<string>;

  searchQuery = '';

  constructor() {
    this.currentUser$ = this.authService.getCurrentUser();
    this.globalLoading$ = this.store.select(selectGlobalLoading);
    this.theme$ = this.store.select(selectTheme);
    this.unreadCount$ = this.store.select(selectUnreadNotificationCount);
    this.pageTitle$ = (this.router.events ?? of()).pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.resolvePageTitle()),
      startWith(this.resolvePageTitle()),
    );
  }

  onMenuClick(): void {
    this.menuToggle.emit();
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  private resolvePageTitle(): string {
    const segment = this.router.url.split('/').filter(Boolean)[0] ?? 'dashboard';
    return ROUTE_TITLES[segment] ?? 'Arcflow';
  }
}
