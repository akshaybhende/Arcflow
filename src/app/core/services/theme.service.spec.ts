import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('dark-theme');
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query.includes('dark') ? false : false,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    service = TestBed.inject(ThemeService);
  });

  it('sets dark theme on document', () => {
    service.setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(localStorage.getItem('arcflow-theme-preference')).toBe('dark');
  });

  it('toggles between light and dark', () => {
    service.setTheme('light');
    service.toggleTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
