import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../models';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private readonly apiUrl = '/api/companies';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  getById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  create(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  update(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${company.id}`, company);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Company[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Company[]>(this.apiUrl, { params });
  }
}
