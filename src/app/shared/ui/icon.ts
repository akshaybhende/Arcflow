import { Directive, computed, input } from '@angular/core';
import { hlm } from './utils';

@Directive({
  selector: 'span[hlmIcon], i[hlmIcon]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
    style: 'font-family: "Material Icons Round"; font-style: normal; user-select: none;',
  },
})
export class HlmIconDirective {
  size = input<'xs' | 'sm' | 'default' | 'lg' | 'xl'>('default');
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() => {
    const sizeMap = {
      xs: 'text-base',
      sm: 'text-lg',
      default: 'text-2xl',
      lg: 'text-3xl',
      xl: 'text-4xl',
    };
    return hlm(
      'material-icons-round inline-flex items-center justify-center leading-none',
      sizeMap[this.size()],
      this.userClass()
    );
  });
}
