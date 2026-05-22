import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const roles = route.data['roles'] as UserRole[] | undefined;
    if (!roles?.length) {
      return true;
    }

    const allowed = roles.some((role) => this.authService.hasRole(role));
    if (!allowed) {
      void this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
