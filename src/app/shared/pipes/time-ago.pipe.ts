import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';

@Pipe({ name: 'timeAgo', standalone: false })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? parseISO(value) : value;

    if (!isValid(date)) {
      return '';
    }

    const secondsAgo = (Date.now() - date.getTime()) / 1000;

    if (secondsAgo < 60) {
      return 'just now';
    }

    return formatDistanceToNow(date, { addSuffix: true });
  }
}
