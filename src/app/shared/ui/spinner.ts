import { Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { hlm } from './utils';

export const spinnerVariants = cva('animate-spin rounded-full border-2 border-current border-t-transparent', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
  },
  defaultVariants: { size: 'default' },
});

@Component({
  selector: 'hlm-spinner',
  standalone: true,
  template: `
    <div [class]="_computedClass()" role="status" aria-label="Loading">
      <span class="sr-only">Loading...</span>
    </div>
  `,
})
export class HlmSpinnerComponent {
  size = input<VariantProps<typeof spinnerVariants>['size']>('default');
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() => hlm(spinnerVariants({ size: this.size() }), this.userClass()));
}
