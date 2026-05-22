import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinner {
  @Input() diameter = 40;
  @Input() label = 'Loading';
}
