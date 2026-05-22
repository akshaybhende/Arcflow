import { CurrencyFormatPipe } from './currency-format.pipe';

describe('CurrencyFormatPipe', () => {
  const pipe = new CurrencyFormatPipe();

  it('formats values under 1K', () => {
    expect(pipe.transform(999)).toBe('$999');
  });

  it('formats thousands', () => {
    expect(pipe.transform(24500)).toBe('$24.5K');
    expect(pipe.transform(1000)).toBe('$1K');
  });

  it('formats millions', () => {
    expect(pipe.transform(1200000)).toBe('$1.2M');
  });

  it('handles null', () => {
    expect(pipe.transform(null)).toBe('$0');
  });
});
