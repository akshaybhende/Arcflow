import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', standalone: false })
export class InitialsPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value?.trim()) {
      return '';
    }

    const parts = value.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
