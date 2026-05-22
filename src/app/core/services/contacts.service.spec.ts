import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContactsService } from './contacts.service';

describe('ContactsService', () => {
  let service: ContactsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContactsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll requests contacts collection', () => {
    service.getAll().subscribe();
    const req = httpMock.expectOne('/api/contacts');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getById requests a single contact', () => {
    service.getById('c1').subscribe();
    const req = httpMock.expectOne('/api/contacts/c1');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'c1' });
  });

  it('create posts a new contact', () => {
    service
      .create({
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        status: 'active',
        leadSource: 'website',
        tags: [],
        dealIds: [],
        activityIds: [],
        owner: 'Demo',
      })
      .subscribe();
    const req = httpMock.expectOne('/api/contacts');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'new' });
  });

  it('delete removes a contact', () => {
    service.delete('c1').subscribe();
    const req = httpMock.expectOne('/api/contacts/c1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
