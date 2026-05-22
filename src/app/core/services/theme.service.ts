import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { setTheme } from '../../store/ui/ui.actions';
import { AppTheme } from '../../store/ui/ui.state';

export type ThemePreference = 'light' | 'dark' | 'system';
export type AccentColorId = 'blue' | 'indigo' | 'violet' | 'teal' | 'rose';

export interface AccentColorOption {
  id: AccentColorId;
  label: string;
  primary: string;
  primaryDark: string;
  primarySubtle: string;
}

export const ACCENT_COLOR_OPTIONS: AccentColorOption[] = [
  { id: 'blue', label: 'Blue', primary: '#2563eb', primaryDark: '#1d4ed8', primarySubtle: '#eff6ff' },
  { id: 'indigo', label: 'Indigo', primary: '#4f46e5', primaryDark: '#4338ca', primarySubtle: '#eef2ff' },
  { id: 'violet', label: 'Violet', primary: '#7c3aed', primaryDark: '#6d28d9', primarySubtle: '#f5f3ff' },
  { id: 'teal', label: 'Teal', primary: '#0d9488', primaryDark: '#0f766e', primarySubtle: '#f0fdfa' },
  { id: 'rose', label: 'Rose', primary: '#e11d48', primaryDark: '#be123c', primarySubtle: '#fff1f2' },
];

const THEME_PREF_KEY = 'arcflow-theme-preference';
const ACCENT_KEY = 'arcflow-accent';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly store = inject(Store);
  private readonly preference$ = new BehaviorSubject<ThemePreference>('system');
  private readonly resolvedTheme$ = new BehaviorSubject<AppTheme>('light');
  private readonly accent$ = new BehaviorSubject<AccentColorId>('blue');
  private mediaQuery?: MediaQueryList;

  constructor() {
    if (!localStorage.getItem(THEME_PREF_KEY)) {
      const legacy = localStorage.getItem('arcflow-theme');
      if (legacy === 'light' || legacy === 'dark') {
        localStorage.setItem(THEME_PREF_KEY, legacy);
      }
    }

    const savedPref = localStorage.getItem(THEME_PREF_KEY) as ThemePreference | null;
    const preference: ThemePreference =
      savedPref === 'light' || savedPref === 'dark' || savedPref === 'system' ? savedPref : 'system';
    this.preference$.next(preference);

    const savedAccent = localStorage.getItem(ACCENT_KEY) as AccentColorId | null;
    const accent =
      ACCENT_COLOR_OPTIONS.some((c) => c.id === savedAccent) ? savedAccent! : 'blue';
    this.applyAccent(accent, false);

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', () => {
      if (this.preference$.value === 'system') {
        this.applyResolvedTheme(false);
      }
    });

    this.applyResolvedTheme(true);
  }

  setThemePreference(preference: ThemePreference): void {
    this.preference$.next(preference);
    localStorage.setItem(THEME_PREF_KEY, preference);
    this.applyResolvedTheme(true);
  }

  setTheme(theme: AppTheme): void {
    this.setThemePreference(theme);
  }

  toggleTheme(): void {
    const next: AppTheme = this.resolvedTheme$.value === 'light' ? 'dark' : 'light';
    this.setThemePreference(next);
  }

  setAccentColor(accent: AccentColorId): void {
    this.applyAccent(accent, true);
  }

  getThemePreference(): Observable<ThemePreference> {
    return this.preference$.asObservable();
  }

  getTheme(): Observable<AppTheme> {
    return this.resolvedTheme$.asObservable();
  }

  getAccentColor(): Observable<AccentColorId> {
    return this.accent$.asObservable();
  }

  get currentThemePreference(): ThemePreference {
    return this.preference$.value;
  }

  get currentTheme(): AppTheme {
    return this.resolvedTheme$.value;
  }

  get currentAccent(): AccentColorId {
    return this.accent$.value;
  }

  private resolveTheme(preference: ThemePreference): AppTheme {
    if (preference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return preference;
  }

  private applyResolvedTheme(dispatch: boolean): void {
    const resolved = this.resolveTheme(this.preference$.value);
    document.documentElement.setAttribute('data-theme', resolved);
    document.body.classList.toggle('dark-theme', resolved === 'dark');
    this.resolvedTheme$.next(resolved);

    if (dispatch) {
      this.store.dispatch(setTheme({ theme: resolved }));
    }
  }

  private applyAccent(accent: AccentColorId, persist: boolean): void {
    const option = ACCENT_COLOR_OPTIONS.find((c) => c.id === accent) ?? ACCENT_COLOR_OPTIONS[0];
    document.documentElement.style.setProperty('--color-primary', option.primary);
    document.documentElement.style.setProperty('--color-primary-dark', option.primaryDark);
    document.documentElement.style.setProperty('--color-primary-subtle', option.primarySubtle);
    document.documentElement.style.setProperty('--color-text-link', option.primary);
    document.documentElement.style.setProperty('--color-brand-500', option.primary);
    document.documentElement.style.setProperty('--color-brand-600', option.primaryDark);
    document.documentElement.style.setProperty('--color-brand-700', option.primaryDark);
    this.accent$.next(option.id);

    if (persist) {
      localStorage.setItem(ACCENT_KEY, option.id);
    }
  }
}
