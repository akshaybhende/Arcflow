import { Component, Directive, computed, input } from '@angular/core';
import { hlm } from './utils';

@Directive({
  selector: '[hlmThead]',
  standalone: true,
  host: { '[class]': '"[&_tr]:border-b"' },
})
export class HlmTheadDirective {}

@Directive({
  selector: '[hlmTbody]',
  standalone: true,
  host: { '[class]': '"[&_tr:last-child]:border-0"' },
})
export class HlmTbodyDirective {}

@Directive({
  selector: '[hlmTr]',
  standalone: true,
  host: {
    '[class]': '"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"',
  },
})
export class HlmTrDirective {}

@Directive({
  selector: '[hlmTh]',
  standalone: true,
  host: {
    '[class]':
      '"h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"',
  },
})
export class HlmThDirective {}

@Directive({
  selector: '[hlmTd]',
  standalone: true,
  host: {
    '[class]': '"p-4 align-middle [&:has([role=checkbox])]:pr-0"',
  },
})
export class HlmTdDirective {}

@Component({
  selector: 'hlm-table',
  standalone: true,
  template: `
    <div [class]="_hostClass()">
      <table class="w-full caption-bottom text-sm">
        <ng-content />
      </table>
    </div>
  `,
})
export class HlmTableComponent {
  userClass = input<string>('', { alias: 'class' });
  _hostClass = computed(() => hlm('relative w-full overflow-auto', this.userClass()));
}
