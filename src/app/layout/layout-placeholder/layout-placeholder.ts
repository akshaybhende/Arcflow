import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout-placeholder',
  template: `
    <app-page-header [title]="title" [subtitle]="subtitle"></app-page-header>
    <p class="layout-placeholder__hint">Feature module coming soon.</p>
  `,
  styles: [
    `
      .layout-placeholder__hint {
        color: var(--color-text-secondary);
        margin-top: var(--space-4);
      }
    `,
  ],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPlaceholder {
  private readonly route = inject(ActivatedRoute);

  get title(): string {
    return this.route.snapshot.data['title'] ?? 'Arcflow';
  }

  get subtitle(): string {
    return this.route.snapshot.data['subtitle'] ?? '';
  }
}
