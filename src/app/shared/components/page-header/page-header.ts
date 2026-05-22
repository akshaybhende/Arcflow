import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface PageHeaderBreadcrumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() breadcrumbs?: PageHeaderBreadcrumb[];
}
