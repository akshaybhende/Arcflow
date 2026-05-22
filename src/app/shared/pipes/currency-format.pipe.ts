import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat', standalone: false })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return '$0';
    }

    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (abs >= 1_000_000) {
      const millions = abs / 1_000_000;
      const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
      return `${sign}$${formatted}M`;
    }

    if (abs >= 1_000) {
      const thousands = abs / 1_000;
      const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1);
      return `${sign}$${formatted}K`;
    }

    return `${sign}$${abs.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
}
