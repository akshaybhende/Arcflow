import { Component, computed, input } from '@angular/core';
import { hlm } from './utils';

@Component({
  selector: 'hlm-label, label[hlmLabel]',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '_computedClass()' },
})
export class HlmLabelComponent {
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() =>
    hlm(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      this.userClass()
    )
  );
}
