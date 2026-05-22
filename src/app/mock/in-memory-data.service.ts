import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import {
  MOCK_ACTIVITIES,
  MOCK_COMPANIES,
  MOCK_CONTACTS,
  MOCK_DEALS,
  MOCK_USERS,
} from './mock-data';

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb(): Record<string, unknown[]> {
    return {
      contacts: MOCK_CONTACTS,
      companies: MOCK_COMPANIES,
      deals: MOCK_DEALS,
      activities: MOCK_ACTIVITIES,
      users: MOCK_USERS,
    };
  }
}
