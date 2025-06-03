import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

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
export class ClubOverviewResolver implements Resolve<ClubOverviewData> {
  resolve(): Observable<ClubOverviewData> {
    // In a real application, this would be an HTTP call to your backend
    return of({
      footballClubsValue: 1210,
      iceHockeyClubsValue: 1210,
      basketballClubsValue: 1210,
      rugbyClubsValue: 1210,
      handballClubsValue: 1210,
      volleyballClubsValue: 1210,
      clubs: [
        {
          id: 1,
          user: {
            name: 'John Doe',
            avatar: 'assets/avatars/john.jpg',
            role: 'Club Manager'
          },
          owner: 'Autumn Phillips',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Plus (Yearly)'
        },
        {
          id: 2,
          user: {
            name: 'Cathy Martinez',
            avatar: 'assets/avatars/cathy.jpg',
            role: 'Team Coach'
          },
          owner: 'Rodger Struck',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Pro (Monthly)'
        },
        {
          id: 3,
          user: {
            name: 'Joshua Jones',
            avatar: 'assets/avatars/joshua.jpg',
            role: 'Club Admin'
          },
          owner: 'Patricia Sanders',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Plus (Yearly)'
        },
        {
          id: 4,
          user: {
            name: 'Maria Williams',
            avatar: 'assets/avatars/maria.jpg',
            role: 'Team Manager'
          },
          owner: 'Joshua Jones',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Plus (Yearly)'
        },
        {
          id: 5,
          user: {
            name: 'Adam Taylor',
            avatar: 'assets/avatars/adam.jpg',
            role: 'Club Admin'
          },
          owner: 'Katie Sims',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Pro (Monthly)'
        },
        {
          id: 6,
          user: {
            name: 'Olivia Rye',
            avatar: 'assets/avatars/olivia.jpg',
            role: 'Media Specialist'
          },
          owner: 'Alex Buckmaster',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Plus (Yearly)'
        },
        {
          id: 7,
          user: {
            name: 'Liam Smith',
            avatar: 'assets/avatars/liam.jpg',
            role: 'Player'
          },
          owner: 'Samantha Lee',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Pro (Monthly)'
        },
        {
          id: 8,
          user: {
            name: 'Emma Brown',
            avatar: 'assets/avatars/emma.jpg',
            role: 'Coach'
          },
          owner: 'Michael Green',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Plus (Yearly)'
        },
        {
          id: 9,
          user: {
            name: 'Noah Wilson',
            avatar: 'assets/avatars/noah.jpg',
            role: 'Team Manager'
          },
          owner: 'Jessica Smith',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Plus (Yearly)'
        },
        {
          id: 10,
          user: {
            name: 'Sophia Lee',
            avatar: 'assets/avatars/sophia.jpg',
            role: 'Club Admin'
          },
          owner: 'David Clark',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Pro (Monthly)'
        },
        {
          id: 11,
          user: {
            name: 'Mason Clark',
            avatar: 'assets/avatars/mason.jpg',
            role: 'Player'
          },
          owner: 'Emily Turner',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Plus (Yearly)'
        },
        {
          id: 12,
          user: {
            name: 'Ava Scott',
            avatar: 'assets/avatars/ava.jpg',
            role: 'Media Specialist'
          },
          owner: 'Brian Adams',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Pro (Monthly)'
        },
        {
          id: 13,
          user: {
            name: 'Ethan King',
            avatar: 'assets/avatars/ethan.jpg',
            role: 'Team Coach'
          },
          owner: 'Laura White',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Plus (Yearly)'
        },
        {
          id: 14,
          user: {
            name: 'Isabella Green',
            avatar: 'assets/avatars/isabella.jpg',
            role: 'Club Manager'
          },
          owner: 'Chris Evans',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Pro (Monthly)'
        },
        {
          id: 15,
          user: {
            name: 'James Hall',
            avatar: 'assets/avatars/james.jpg',
            role: 'Player'
          },
          owner: 'Sarah Parker',
          subscriptionDate: 'Apr 16, 2025',
          subscription: 'Plus (Yearly)'
        }
      ]
    });
  }
} 