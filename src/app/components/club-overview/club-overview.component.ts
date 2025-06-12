import { Component, OnInit } from '@angular/core';
import { ClubsComponent } from './clubs/clubs.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ClubOverviewData } from './club-overview.resolver';

@Component({
  selector: 'app-club-overview',
  imports: [ClubsComponent, CommonModule, MatIconModule],
  templateUrl: './club-overview.component.html',
  styleUrl: './club-overview.component.scss',
  standalone: true
})
export class ClubOverviewComponent implements OnInit {
  footballClubsValue = 0;
  iceHockeyClubsValue = 0;
  basketballClubsValue = 0;
  americanFootballClubsValue = 0;
  handballClubsValue = 0;
  volleyballClubsValue = 0;
  clubCountBySport: Array<{ sportId: string; sportName: string; clubCount: number }> = [];
  activeTab: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      this.footballClubsValue = data.footballClubsValue;
      this.iceHockeyClubsValue = data.iceHockeyClubsValue;
      this.basketballClubsValue = data.basketballClubsValue;
      this.americanFootballClubsValue = data.americanFootballClubsValue;
      this.handballClubsValue = data.handballClubsValue;
      this.volleyballClubsValue = data.volleyballClubsValue;
      this.clubCountBySport = data.clubCountBySport;
      if (this.clubCountBySport.length > 0) {
        this.activeTab = this.clubCountBySport[0].sportId;
      }
    });
  }

  setActiveTab(sportId: string) {
    this.activeTab = sportId;
  }
}
