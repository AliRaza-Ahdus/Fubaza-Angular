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
  footballPlayersValue = 0;
  basketballPlayersValue = 0;
  iceHockeyPlayersValue = 0;
  americanFootballPlayersValue = 0;
  handballPlayersValue = 0;
  volleyballPlayersValue = 0;
  players: PlayerItem[] = [];
  playerCountBySport: Array<{ sportId: string; sportName: string; playerCount: number }> = [];
  activeTab: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      this.footballPlayersValue = data.footballPlayersValue;
      this.basketballPlayersValue = data.basketballPlayersValue;
      this.iceHockeyPlayersValue = data.iceHockeyPlayersValue;
      this.americanFootballPlayersValue = data.americanFootballPlayersValue;
      this.handballPlayersValue = data.handballPlayersValue;
      this.volleyballPlayersValue = data.volleyballPlayersValue;
      this.playerCountBySport = data.playerCountBySport || [];
      if (this.playerCountBySport.length > 0) {
        this.activeTab = this.playerCountBySport[0].sportId;
      }
    });
  }

  setActiveTab(sportId: string) {
    this.activeTab = sportId;
  }
}
