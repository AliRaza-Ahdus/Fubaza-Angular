import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClubOverviewService, ClubCountBySportResponse } from '../../services/club-overview.service';

export interface ClubItem {
  id: number;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  owner: string;
  subscriptionDate: string;
  subscription: string;
}

export interface ClubOverviewData {
  footballClubsValue: number;
  iceHockeyClubsValue: number;
  basketballClubsValue: number;
  rugbyClubsValue: number;
  handballClubsValue: number;
  volleyballClubsValue: number;
  clubs: ClubItem[]; // Keep clubs data for the table
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
          // Normalize sport names for mapping
          const name = item.sportName.toLowerCase();
          if (name.includes('football') && !name.includes('american')) sportMap['football'] = item.clubCount;
          else if (name.includes('basketball')) sportMap['basketball'] = item.clubCount;
          else if (name.includes('ice hockey')) sportMap['iceHockey'] = item.clubCount;
          else if (name.includes('rugby')) sportMap['rugby'] = item.clubCount;
          else if (name.includes('handball')) sportMap['handball'] = item.clubCount;
          else if (name.includes('volleyball')) sportMap['volleyball'] = item.clubCount;
        });
        return {
          footballClubsValue: sportMap['football'] || 0,
          iceHockeyClubsValue: sportMap['iceHockey'] || 0,
          basketballClubsValue: sportMap['basketball'] || 0,
          rugbyClubsValue: sportMap['rugby'] || 0,
          handballClubsValue: sportMap['handball'] || 0,
          volleyballClubsValue: sportMap['volleyball'] || 0,
          clubs: [] // You can fetch clubs list separately if needed
        };
      })
    );
  }
} 