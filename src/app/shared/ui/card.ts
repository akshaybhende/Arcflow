import { Component, computed, input } from '@angular/core';
import { hlm } from './utils';

@Component({
  selector: 'hlm-card',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '_computedClass()' },
})
export class HlmCardComponent {
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() =>
    hlm('rounded-lg border bg-card text-card-foreground shadow-sm', this.userClass())
  );
}

@Component({
  selector: 'hlm-card-header',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '_computedClass()' },
})
export class HlmCardHeaderComponent {
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() => hlm('flex flex-col space-y-1.5 p-6', this.userClass()));
}

@Component({
  selector: 'hlm-card-title',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '_computedClass()' },
})
export class HlmCardTitleComponent {
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() =>
    hlm('text-2xl font-semibold leading-none tracking-tight', this.userClass())
  );
}

@Component({
  selector: 'hlm-card-description',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '_computedClass()' },
})
export class HlmCardDescriptionComponent {
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() => hlm('text-sm text-muted-foreground', this.userClass()));
}

@Component({
  selector: 'hlm-card-content',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '_computedClass()' },
})
export class HlmCardContentComponent {
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() => hlm('p-6 pt-0', this.userClass()));
}

@Component({
  selector: 'hlm-card-footer',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '_computedClass()' },
})
export class HlmCardFooterComponent {
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() => hlm('flex items-center p-6 pt-0', this.userClass()));
}
