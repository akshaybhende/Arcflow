import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  it('authenticates with demo credentials', async () => {
    const user = await firstValueFrom(service.login('demo@arcflow.io', 'demo123'));
    expect(user.email).toBe('demo@arcflow.io');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('rejects invalid credentials', async () => {
    await expect(firstValueFrom(service.login('bad@example.com', 'wrong'))).rejects.toBeDefined();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('clears session on logout', async () => {
    await firstValueFrom(service.login('alex@arcflow.io', 'demo123'));
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });
});
