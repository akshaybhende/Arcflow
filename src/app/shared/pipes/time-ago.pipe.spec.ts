import { subDays, subSeconds } from 'date-fns';
import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  const pipe = new TimeAgoPipe();

  it('returns just now for recent timestamps', () => {
    const iso = subSeconds(new Date(), 30).toISOString();
    expect(pipe.transform(iso)).toBe('just now');
  });

  it('returns minutes ago', () => {
    const iso = subSeconds(new Date(), 300).toISOString();
    expect(pipe.transform(iso)).toContain('minute');
  });

  it('returns days ago', () => {
    const iso = subDays(new Date(), 3).toISOString();
    expect(pipe.transform(iso)).toContain('day');
  });
});
