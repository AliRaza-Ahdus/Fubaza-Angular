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

export interface PlayersResponse {
  success: boolean;
  message: string;
  data: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    items: Array<{
      id: string;
      fullName: string;
      dateOfBirth: string;
      subscriptionPlan: string;
      subscriptionDate: string;
      playingPosition: string;
      currentClub: string;
      fileUrl: string | null;
    }>;
  };
}

export interface PlayersRequest {
  sportId: string;
  pageNumber: number;
  pageSize: number;
  SearchTerm: string;
}

@Injectable({ providedIn: 'root' })
export class PlayerOverviewService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPlayerCountBySport(): Observable<PlayerCountBySportResponse> {
    return this.http.get<PlayerCountBySportResponse>(`${this.baseUrl}/api/PlayerOverview/PlayerCountBySport`);
  }

  getPlayers(request: PlayersRequest): Observable<PlayersResponse> {
    return this.http.post<PlayersResponse>(`${this.baseUrl}/api/PlayerOverview/Players`, request);
  }
} 