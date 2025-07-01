import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ClubCountBySportResponse,
  ClubsResponse,
  ClubInfoResponse
} from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ClubOverviewService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClubCountBySport(): Observable<ClubCountBySportResponse> {
    return this.http.get<ClubCountBySportResponse>(`${this.baseUrl}/api/ClubOverview/ClubCountBySport`);
  }

  getClubs(request: { sportId: string; pageNumber: number; pageSize: number; SearchTerm?: string }): Observable<ClubsResponse> {
    return this.http.post<ClubsResponse>(`${this.baseUrl}/api/ClubOverview/Clubs`, request);
  }

  getClubInfo(clubId: string): Observable<ClubInfoResponse> {
    return this.http.get<ClubInfoResponse>(`${this.baseUrl}/api/ClubOverview/ClubInfo/${clubId}`);
  }
} 