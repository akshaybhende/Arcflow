import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, startWith } from 'rxjs/operators';
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

  readonly currentUser$ = this.authService.getCurrentUser();
  readonly globalLoading$ = this.store.select(selectGlobalLoading);
  readonly theme$ = this.store.select(selectTheme);
  readonly unreadCount$ = this.store.select(selectUnreadNotificationCount);

  searchQuery = '';

  readonly pageTitle$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(() => this.resolvePageTitle()),
    startWith(this.resolvePageTitle()),
  );

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
