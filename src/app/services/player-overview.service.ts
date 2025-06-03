import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PlayerCountBySportResponse {
  success: boolean;
  message: string;
  data: Array<{
    sportId: string;
    sportName: string;
    playerCount: number;
  }>;
  error: any[];
}

export interface PlayerOverviewData {
  playerCountBySport: Array<{
    sportId: string;
    sportName: string;
    playerCount: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class PlayerOverviewService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPlayerCountBySport(): Observable<PlayerCountBySportResponse> {
    return this.http.get<PlayerCountBySportResponse>(`${this.baseUrl}/api/PlayerOverview/PlayerCountBySport`);
  }
} 