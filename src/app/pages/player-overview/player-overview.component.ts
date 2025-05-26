import { Component } from '@angular/core';
import { PlayersComponent } from './players/players.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-player-overview',
  imports: [CommonModule, MatIconModule,PlayersComponent],
  templateUrl: './player-overview.component.html',
  styleUrl: './player-overview.component.scss'
})
export class PlayerOverviewComponent {
  sportsCards = [
    {
      title: 'Football Players',
      value: 4850,
      colorClass: 'bg-football',
      icon: 'sports_soccer'
    },
    {
      title: 'Ice Hockey Players',
      value: 3200,
      colorClass: 'bg-icehockey',
      icon: 'sports_hockey'
    },
    {
      title: 'Basketball Players',
      value: 2750,
      colorClass: 'bg-basketball',
      icon: 'sports_basketball'
    },
    {
      title: 'Rugby Players',
      value: 1850,
      colorClass: 'bg-rugby',
      icon: 'sports_rugby'
    }
  ];
}
