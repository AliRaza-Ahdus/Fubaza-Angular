import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerOverviewService, PlayerCountBySportResponse } from '../../services/player-overview.service';

export interface PlayerItem {
  id: number;
  player: {
    name: string;
    avatar: string;
  };
  club: string;
  position: string;
  dob: string;
  subscriptionPlan: string;
}

export interface PlayerOverviewData {
  footballPlayersValue: number;
  iceHockeyPlayersValue: number;
  basketballPlayersValue: number;
  rugbyPlayersValue: number;
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
          const name = item.sportName.toLowerCase();
          if (name.includes('football') && !name.includes('american')) sportMap['football'] = item.playerCount;
          else if (name.includes('basketball')) sportMap['basketball'] = item.playerCount;
          else if (name.includes('ice hockey')) sportMap['iceHockey'] = item.playerCount;
          else if (name.includes('rugby')) sportMap['rugby'] = item.playerCount;
          else if (name.includes('handball')) sportMap['handball'] = item.playerCount;
          else if (name.includes('volleyball')) sportMap['volleyball'] = item.playerCount;
        });
        return {
          footballPlayersValue: sportMap['football'] || 0,
          iceHockeyPlayersValue: sportMap['iceHockey'] || 0,
          basketballPlayersValue: sportMap['basketball'] || 0,
          rugbyPlayersValue: sportMap['rugby'] || 0,
          handballPlayersValue: sportMap['handball'] || 0,
          volleyballPlayersValue: sportMap['volleyball'] || 0,
          players: [],
          playerCountBySport: response.data
        };
      })
    );
  }
} 