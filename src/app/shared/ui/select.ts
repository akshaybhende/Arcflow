import { Component, Directive, computed, input } from '@angular/core';
import { hlm } from './utils';

/* Native select styled wrapper - simpler and more compatible than brain-based select */
@Directive({
  selector: 'select[hlmSelect]',
  standalone: true,
  host: { '[class]': '_computedClass()' },
})
export class HlmSelectDirective {
  userClass = input<string>('', { alias: 'class' });
  _computedClass = computed(() =>
    hlm(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      this.userClass()
    )
  );
}

/* Form field wrapper */
@Component({
  selector: 'hlm-form-field',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '"flex flex-col gap-1.5"' },
})
export class HlmFormFieldComponent {}

/* Error message */
@Component({
  selector: 'hlm-error',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '"text-xs text-destructive"' },
})
export class HlmErrorComponent {}

/* Hint/description */
@Component({
  selector: 'hlm-hint',
  standalone: true,
  template: `<ng-content />`,
  host: { '[class]': '"text-xs text-muted-foreground"' },
})
export class HlmHintComponent {}
