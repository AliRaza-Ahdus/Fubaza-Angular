import { Component } from '@angular/core';
import { ClubsComponent } from './clubs/clubs.component';

import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-club-overview',
  imports: [ClubsComponent, CommonModule, MatIconModule],
  templateUrl: './club-overview.component.html',
  styleUrl: './club-overview.component.scss'
})
export class ClubOverviewComponent {
  sportsCards = [
    {
      title: 'Football Clubs',
      value: 1210,
      colorClass: 'bg-football',
      icon: 'sports_soccer'
    },
    {
      title: 'Ice hockey Clubs',
      value: 1210,
      colorClass: 'bg-icehockey',
      icon: 'sports_hockey'
    },
    {
      title: 'Basketball Clubs',
      value: 1210,
      colorClass: 'bg-basketball',
      icon: 'sports_basketball'
    },
    {
      title: 'Rugby Clubs',
      value: 1210,
      colorClass: 'bg-rugby',
      icon: 'sports_rugby'
    }
  ];
}
