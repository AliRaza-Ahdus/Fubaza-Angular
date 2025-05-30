import { Component, OnInit } from '@angular/core';
import { PlayersComponent } from './players/players.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PlayerOverviewData, SportsCard, PlayerItem } from './player-overview.resolver';

@Component({
  selector: 'app-player-overview',
  imports: [CommonModule, MatIconModule, PlayersComponent],
  templateUrl: './player-overview.component.html',
  styleUrl: './player-overview.component.scss',
  standalone: true
})
export class PlayerOverviewComponent implements OnInit {
  sportsCards: SportsCard[] = [];
  players: PlayerItem[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      this.sportsCards = data.sportsCards;
      this.players = data.players;
    });
  }
}
