import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerOverviewService, PlayerCountBySportResponse } from '../../services/player-overview.service';

export interface PlayerItem {
  id: string;
  player: {
    name: string;
    avatar: string;
  };
  club: string;
  position: string;
  dob: string;
  subscriptionPlan: string;
  subscriptionDate: string;
}

export interface PlayerOverviewData {
  footballPlayersValue: number;
  basketballPlayersValue: number;
  iceHockeyPlayersValue: number;
  americanFootballPlayersValue: number;
  handballPlayersValue: number;
  volleyballPlayersValue: number;
  players: PlayerItem[];
  playerCountBySport: Array<{
    sportId: string;
    sportName: string;
    playerCount: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerOverviewResolver implements Resolve<Observable<PlayerOverviewData>> {
  constructor(private playerOverviewService: PlayerOverviewService) {}

  resolve(): Observable<PlayerOverviewData> {
    return this.playerOverviewService.getPlayerCountBySport().pipe(
      map((response: PlayerCountBySportResponse) => {
        const sportMap: Record<string, number> = {};
        response.data.forEach(item => {
          switch(item.sportName) {
            case 'Football':
              sportMap['football'] = item.playerCount;
              break;
            case 'Basketball':
              sportMap['basketball'] = item.playerCount;
              break;
            case 'Ice Hockey':
              sportMap['iceHockey'] = item.playerCount;
              break;
            case 'American Football':
              sportMap['americanFootball'] = item.playerCount;
              break;
            case 'Handball':
              sportMap['handball'] = item.playerCount;
              break;
            case 'Volleyball':
              sportMap['volleyball'] = item.playerCount;
              break;
          }
        });
        return {
          footballPlayersValue: sportMap['football'] || 0,
          basketballPlayersValue: sportMap['basketball'] || 0,
          iceHockeyPlayersValue: sportMap['iceHockey'] || 0,
          americanFootballPlayersValue: sportMap['americanFootball'] || 0,
          handballPlayersValue: sportMap['handball'] || 0,
          volleyballPlayersValue: sportMap['volleyball'] || 0,
          players: [],
          playerCountBySport: response.data
        };
      })
    );
  }
} 