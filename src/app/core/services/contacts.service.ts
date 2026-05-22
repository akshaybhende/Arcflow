import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly apiUrl = '/api/contacts';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  getById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  create(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  update(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${contact.id}`, contact);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Contact[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Contact[]>(this.apiUrl, { params });
  }
}
