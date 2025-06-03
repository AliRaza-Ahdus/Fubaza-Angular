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
  iceHockeyPlayersValue = 0;
  basketballPlayersValue = 0;
  rugbyPlayersValue = 0;
  handballPlayersValue = 0;
  volleyballPlayersValue = 0;
  players: PlayerItem[] = [
    {
      id: 1,
      player: { name: 'John Smith', avatar: 'assets/avatars/john.jpg' },
      club: 'Manchester United',
      position: 'Forward',
      dob: '1995-05-15',
      subscriptionPlan: 'Pro (Monthly)'
    },
    {
      id: 2,
      player: { name: 'Emma Wilson', avatar: 'assets/avatars/emma.jpg' },
      club: 'Liverpool FC',
      position: 'Midfielder',
      dob: '1998-08-22',
      subscriptionPlan: 'Plus (Yearly)'
    },
    // ... add more static players as needed
  ];

  playerCountBySport: Array<{ sportId: string; sportName: string; playerCount: number }> = [];
  activeTab: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      this.footballPlayersValue = data.footballPlayersValue;
      this.iceHockeyPlayersValue = data.iceHockeyPlayersValue;
      this.basketballPlayersValue = data.basketballPlayersValue;
      this.rugbyPlayersValue = data.rugbyPlayersValue;
      this.handballPlayersValue = data.handballPlayersValue;
      this.volleyballPlayersValue = data.volleyballPlayersValue;
      this.playerCountBySport = data.playerCountBySport || [];
      if (this.playerCountBySport.length > 0) {
        this.activeTab = this.playerCountBySport[0].sportId;
      }
      // Keep using static players for the table
    });
  }

  setActiveTab(sportId: string) {
    this.activeTab = sportId;
    // Filtering logic can be added here
  }
}
