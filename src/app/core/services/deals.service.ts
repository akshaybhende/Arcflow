import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deal } from '../models';

@Injectable({ providedIn: 'root' })
export class DealsService {
  private readonly apiUrl = '/api/deals';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Deal[]> {
    return this.http.get<Deal[]>(this.apiUrl);
  }

  getById(id: string): Observable<Deal> {
    return this.http.get<Deal>(`${this.apiUrl}/${id}`);
  }

  create(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Observable<Deal> {
    return this.http.post<Deal>(this.apiUrl, deal);
  }

  update(deal: Deal): Observable<Deal> {
    return this.http.put<Deal>(`${this.apiUrl}/${deal.id}`, deal);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Deal[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Deal[]>(this.apiUrl, { params });
  }
}
