import { Component, OnInit } from '@angular/core';
import { PlayersComponent } from './players/players.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PlayerOverviewData, PlayerItem } from './player-overview.resolver';

@Component({
  selector: 'app-player-overview',
  imports: [CommonModule, MatIconModule, PlayersComponent],
  templateUrl: './player-overview.component.html',
  styleUrl: './player-overview.component.scss',
  standalone: true
})
export class PlayerOverviewComponent implements OnInit {
  footballPlayersValue!: number;
  iceHockeyPlayersValue!: number;
  basketballPlayersValue!: number;
  rugbyPlayersValue!: number;
  handballPlayersValue!: number;
  volleyballPlayersValue!: number;
  players: PlayerItem[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      this.footballPlayersValue = data.footballPlayersValue;
      this.iceHockeyPlayersValue = data.iceHockeyPlayersValue;
      this.basketballPlayersValue = data.basketballPlayersValue;
      this.rugbyPlayersValue = data.rugbyPlayersValue;
      this.handballPlayersValue = data.handballPlayersValue;
      this.volleyballPlayersValue = data.volleyballPlayersValue;
      this.players = data.players;
    });
  }
}
