import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClubCountBySportResponse {
  success: boolean;
  message: string;
  data: Array<{
    sportId: string;
    sportName: string;
    clubCount: number;
  }>;
  error: any[];
}

export interface ClubsResponse {
  success: boolean;
  message: string;
  data: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    items: Array<{
      id: string;
      fullName: string;
      owner: string;
      subscriptionPlan: string;
      subscriptionDate: string;
      fileUrl: string | null;
    }>;
  };
}

export interface ClubsRequest {
  sportId: string;
  pageNumber: number;
  pageSize: number;
  SearchTerm: string;
}

@Injectable({ providedIn: 'root' })
export class ClubOverviewService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClubCountBySport(): Observable<ClubCountBySportResponse> {
    return this.http.get<ClubCountBySportResponse>(`${this.baseUrl}/api/ClubOverview/ClubCountBySport`);
  }

  getClubs(request: ClubsRequest): Observable<ClubsResponse> {
    return this.http.post<ClubsResponse>(`${this.baseUrl}/api/ClubOverview/Clubs`, request);
  }
} 