import { Component, computed, input } from '@angular/core';
import { hlm } from './utils';

@Component({
  selector: 'hlm-progress',
  standalone: true,
  template: `
    <div
      role="progressbar"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="100"
      [class]="_hostClass()"
    >
      <div
        class="h-full w-full flex-1 bg-primary transition-all duration-300"
        [style.transform]="'translateX(-' + (100 - (value() ?? 0)) + '%)'"
      ></div>
    </div>
  `,
})
export class HlmProgressComponent {
  value = input<number | null>(null);
  userClass = input<string>('', { alias: 'class' });
  _hostClass = computed(() =>
    hlm('relative h-2 w-full overflow-hidden rounded-full bg-secondary', this.userClass())
  );
}
