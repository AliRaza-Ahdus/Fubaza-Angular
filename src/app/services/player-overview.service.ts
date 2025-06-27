import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  PlayerCountBySportResponse,
  PlayersResponse,
  PlayerInfoResponse,
  PlayerInfo
} from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class PlayerOverviewService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPlayerCountBySport(): Observable<PlayerCountBySportResponse> {
    return this.http.get<PlayerCountBySportResponse>(`${this.baseUrl}/api/PlayerOverview/PlayerCountBySport`);
  }

  getPlayers(request: { sportId: string; pageNumber: number; pageSize: number; SearchTerm?: string }): Observable<PlayersResponse> {
    return this.http.post<PlayersResponse>(`${this.baseUrl}/api/PlayerOverview/Players`, request);
  }

  getPlayerInfo(playerId: string): Observable<PlayerInfoResponse> {
    return this.http.get<PlayerInfoResponse>(`${this.baseUrl}/api/PlayerOverview/PlayerInfo/${playerId}`);
  }
  
} 