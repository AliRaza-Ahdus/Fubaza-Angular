import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sport, SportsListResponse } from '../models/api-response.model';
import type { Templete } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class TempleteService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Example: GET /api/templetes
  getTempletes(): Observable<Templete[]> {
    // Replace with real API call when available
    return of([
      { id: '1', name: 'Football Match', license: 'Football', imageUrl: 'assets/images/football.jpg' },
      { id: '2', name: 'Birthday Card', license: 'Basketball', imageUrl: 'assets/images/birthday.jpg' },
    ]);
  }

  
  getSportsList(): Observable<SportsListResponse> {
    return this.http.get<SportsListResponse>(`${this.baseUrl}/api/lookup/sports`);
  }
}
