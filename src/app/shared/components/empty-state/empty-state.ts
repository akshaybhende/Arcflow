import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
