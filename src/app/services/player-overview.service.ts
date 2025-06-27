import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any[];
}

export type PlayerCountBySportResponse = ApiResponse<Array<{
  sportId: string;
  sportName: string;
  playerCount: number;
}>>;

export interface PlayerOverviewData {
  playerCountBySport: Array<{
    sportId: string;
    sportName: string;
    playerCount: number;
  }>;
}

export type PlayersResponse = ApiResponse<{
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
}>;

export type PlayerInfoResponse = ApiResponse<PlayerInfo>;

export interface PlayerInfo {
  fullName: string;
  dateOfBirth: string;
  gender: number;
  weightKg: number | null;
  heightCm: number | null;
  jerseyNumber: number;
  signedAt: string;
  playingPositionName: string;
  currentClub: string;
  joinedAt: number;
  images: {
    profileUrl: string | null;
    inMotionUrl: string | null;
    celebrationUrl: string | null;
    fullBodyUrl: string | null;
  };
  career: Array<{
    clubId?: string;
    clubName: string;
    startYear: number;
    endYear: number | null;
    isCurrentClub: boolean;
  }>;
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

  getPlayerInfo(playerId: string): Observable<PlayerInfoResponse> {
    return this.http.get<PlayerInfoResponse>(`${this.baseUrl}/api/PlayerOverview/PlayerInfo/${playerId}`);
  }
  
} 