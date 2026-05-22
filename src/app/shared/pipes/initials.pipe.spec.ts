import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
  const pipe = new InitialsPipe();

  it('returns two initials for full name', () => {
    expect(pipe.transform('John Smith')).toBe('JS');
  });

  it('returns single initial for one name', () => {
    expect(pipe.transform('Sarah')).toBe('S');
  });

  it('returns empty for blank input', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
