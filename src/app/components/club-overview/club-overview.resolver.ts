import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClubOverviewService, ClubCountBySportResponse } from '../../services/club-overview.service';

export interface ClubItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  owner: string;
  subscriptionDate: string;
  subscription: string;
}

export interface ClubOverviewData {
  footballClubsValue: number;
  iceHockeyClubsValue: number;
  basketballClubsValue: number;
  americanFootballClubsValue: number;
  handballClubsValue: number;
  volleyballClubsValue: number;
  clubCountBySport: Array<{
    sportId: string;
    sportName: string;
    clubCount: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ClubOverviewResolver implements Resolve<Observable<ClubOverviewData>> {
  constructor(private clubOverviewService: ClubOverviewService) {}

  resolve(): Observable<ClubOverviewData> {
    return this.clubOverviewService.getClubCountBySport().pipe(
      map((response: ClubCountBySportResponse) => {
        const sportMap: Record<string, number> = {};
        response.data.forEach(item => {
          switch(item.sportName) {
            case 'Football':
              sportMap['football'] = item.clubCount;
              break;
            case 'Basketball':
              sportMap['basketball'] = item.clubCount;
              break;
            case 'Ice Hockey':
              sportMap['iceHockey'] = item.clubCount;
              break;
            case 'American Football':
              sportMap['americanFootball'] = item.clubCount;
              break;
            case 'Handball':
              sportMap['handball'] = item.clubCount;
              break;
            case 'Volleyball':
              sportMap['volleyball'] = item.clubCount;
              break;
          }
        });
        return {
          footballClubsValue: sportMap['football'] || 0,
          iceHockeyClubsValue: sportMap['iceHockey'] || 0,
          basketballClubsValue: sportMap['basketball'] || 0,
          americanFootballClubsValue: sportMap['americanFootball'] || 0,
          handballClubsValue: sportMap['handball'] || 0,
          volleyballClubsValue: sportMap['volleyball'] || 0,
          clubCountBySport: response.data
        };
      })
    );
  }
} 