import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../models';

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  private readonly apiUrl = '/api/activities';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  getById(id: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  create(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activity);
  }

  update(activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${activity.id}`, activity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Activity[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Activity[]>(this.apiUrl, { params });
  }
}
