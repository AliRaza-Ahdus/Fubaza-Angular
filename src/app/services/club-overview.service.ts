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

@Injectable({ providedIn: 'root' })
export class ClubOverviewService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClubCountBySport(): Observable<ClubCountBySportResponse> {
    debugger;
    return this.http.get<ClubCountBySportResponse>(`${this.baseUrl}/api/ClubOverview/ClubCountBySport`);
  }
} 