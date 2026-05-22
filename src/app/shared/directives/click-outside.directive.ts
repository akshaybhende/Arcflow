import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';

@Directive({ selector: '[appClickOutside]', standalone: false })
export class ClickOutsideDirective implements OnInit, OnDestroy {
  @Output() appClickOutside = new EventEmitter<void>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private listener: ((event: MouseEvent) => void) | null = null;

  ngOnInit(): void {
    this.listener = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (target && !this.elementRef.nativeElement.contains(target)) {
        this.appClickOutside.emit();
      }
    };

    document.addEventListener('mousedown', this.listener);
  }

  ngOnDestroy(): void {
    if (this.listener) {
      document.removeEventListener('mousedown', this.listener);
    }
  }
}
