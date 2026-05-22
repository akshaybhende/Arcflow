import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { MOCK_USERS } from '../../mock/mock-data';
import { User, UserRole } from '../models';

const AUTH_STORAGE_KEY = 'arcflow-auth-user';
const DEMO_PASSWORD = 'demo123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser$ = new BehaviorSubject<User | null>(this.readStoredUser());

  constructor() {
    this.currentUser$.next(this.readStoredUser());
  }

  login(email: string, password: string): Observable<User> {
    if (!email.endsWith('@arcflow.io') || password !== DEMO_PASSWORD) {
      return throwError(() => new Error('Invalid credentials'));
    }

    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? MOCK_USERS[0];

    return of(user).pipe(
      delay(300),
      tap((loggedInUser) => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
        this.currentUser$.next(loggedInUser);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.currentUser$.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  isAuthenticated(): boolean {
    return this.currentUser$.value !== null;
  }

  get currentUser(): User | null {
    return this.currentUser$.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser$.value?.role === role;
  }

  updateProfile(updates: Partial<Pick<User, 'name' | 'email' | 'department' | 'avatar'>>): void {
    const current = this.currentUser$.value;
    if (!current) {
      return;
    }
    const updated: User = { ...current, ...updates };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    this.currentUser$.next(updated);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }
}
