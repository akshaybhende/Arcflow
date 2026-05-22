import { Component, computed, input } from '@angular/core';
import { hlm } from './utils';

@Component({
  selector: 'hlm-separator',
  standalone: true,
  template: ``,
  host: {
    '[class]': '_computedClass()',
    role: 'separator',
    '[attr.aria-orientation]': 'orientation()',
  },
})
export class HlmSeparatorComponent {
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() =>
    hlm(
      'shrink-0 bg-border',
      this.orientation() === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      this.userClass()
    )
  );
}
