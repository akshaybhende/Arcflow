import { Component, computed, input } from '@angular/core';
import { hlm } from './utils';

@Component({
  selector: 'hlm-avatar',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '_computedClass()' },
})
export class HlmAvatarComponent {
  size = input<'sm' | 'default' | 'lg' | 'xl'>('default');
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() => {
    const sizeMap = {
      sm: 'h-7 w-7 text-xs',
      default: 'h-9 w-9 text-sm',
      lg: 'h-11 w-11 text-base',
      xl: 'h-16 w-16 text-lg',
    };
    return hlm(
      'relative flex shrink-0 overflow-hidden rounded-full',
      sizeMap[this.size()],
      this.userClass()
    );
  });
}

@Component({
  selector: 'hlm-avatar-image',
  standalone: true,
  template: `<img [src]="src()" [alt]="alt()" class="aspect-square h-full w-full object-cover" />`,
  host: { '[class]': '"contents"' },
})
export class HlmAvatarImageComponent {
  src = input<string>('');
  alt = input<string>('');
}

@Component({
  selector: 'hlm-avatar-fallback',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '_computedClass()' },
})
export class HlmAvatarFallbackComponent {
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() =>
    hlm(
      'flex h-full w-full items-center justify-center rounded-full bg-muted font-semibold uppercase tracking-wider',
      this.userClass()
    )
  );
}
