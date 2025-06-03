import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

export interface PlayerOverviewData {
  footballPlayersValue: number;
  iceHockeyPlayersValue: number;
  basketballPlayersValue: number;
  rugbyPlayersValue: number;
  handballPlayersValue: number;
  volleyballPlayersValue: number;
  players: PlayerItem[];
}

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

@Injectable({
  providedIn: 'root'
})
export class PlayerOverviewResolver implements Resolve<PlayerOverviewData> {
  resolve(): Observable<PlayerOverviewData> {
    // In a real application, this would be an HTTP call to your backend
    return of({
      footballPlayersValue: 4850,
      iceHockeyPlayersValue: 3200,
      basketballPlayersValue: 2750,
      rugbyPlayersValue: 1850,
      handballPlayersValue: 2200,
      volleyballPlayersValue: 1500,
      players: [
        {
          id: 1,
          player: {
            name: 'John Smith',
            avatar: 'assets/avatars/john.jpg'
          },
          club: 'Manchester United',
          position: 'Forward',
          dob: '1995-05-15',
          subscriptionPlan: 'Pro (Monthly)'
        },
        {
          id: 2,
          player: {
            name: 'Emma Wilson',
            avatar: 'assets/avatars/emma.jpg'
          },
          club: 'Liverpool FC',
          position: 'Midfielder',
          dob: '1998-08-22',
          subscriptionPlan: 'Plus (Yearly)'
        },
        {
          id: 3,
          player: {
            name: 'Michael Brown',
            avatar: 'assets/avatars/michael.jpg'
          },
          club: 'Arsenal',
          position: 'Defender',
          dob: '1996-11-30',
          subscriptionPlan: 'Pro (Monthly)'
        },
        {
          id: 4,
          player: {
            name: 'Sarah Davis',
            avatar: 'assets/avatars/sarah.jpg'
          },
          club: 'Chelsea',
          position: 'Goalkeeper',
          dob: '1997-03-18',
          subscriptionPlan: 'Plus (Yearly)'
        },
        {
          id: 5,
          player: {
            name: 'David Miller',
            avatar: 'assets/avatars/david.jpg'
          },
          club: 'Tottenham',
          position: 'Forward',
          dob: '1999-07-25',
          subscriptionPlan: 'Pro (Monthly)'
        },
        {
          id: 6,
          player: {
            name: 'Lisa Anderson',
            avatar: 'assets/avatars/lisa.jpg'
          },
          club: 'Manchester City',
          position: 'Midfielder',
          dob: '1996-09-12',
          subscriptionPlan: 'Plus (Yearly)'
        },
        {
          id: 7,
          player: {
            name: 'James Wilson',
            avatar: 'assets/avatars/james.jpg'
          },
          club: 'Leicester City',
          position: 'Defender',
          dob: '1998-01-05',
          subscriptionPlan: 'Pro (Monthly)'
        },
        {
          id: 8,
          player: {
            name: 'Rachel Green',
            avatar: 'assets/avatars/rachel.jpg'
          },
          club: 'West Ham',
          position: 'Forward',
          dob: '1997-06-20',
          subscriptionPlan: 'Plus (Yearly)'
        },
        {
          id: 9,
          player: {
            name: 'Thomas Lee',
            avatar: 'assets/avatars/thomas.jpg'
          },
          club: 'Aston Villa',
          position: 'Midfielder',
          dob: '1999-04-15',
          subscriptionPlan: 'Pro (Monthly)'
        },
        {
          id: 10,
          player: {
            name: 'Jennifer White',
            avatar: 'assets/avatars/jennifer.jpg'
          },
          club: 'Newcastle',
          position: 'Defender',
          dob: '1996-12-08',
          subscriptionPlan: 'Plus (Yearly)'
        }
      ]
    });
  }
} 