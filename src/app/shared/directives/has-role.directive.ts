import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models';

@Directive({
  selector: '[appHasRole]',
  standalone: false,
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private roles: UserRole[] = [];

  @Input()
  set appHasRole(roles: UserRole | UserRole[]) {
    this.roles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor() {
    this.authService
      .getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateView());
  }

  private updateView(): void {
    const user = this.authService.currentUser;
    const visible = user && this.roles.includes(user.role);
    this.viewContainer.clear();
    if (visible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
