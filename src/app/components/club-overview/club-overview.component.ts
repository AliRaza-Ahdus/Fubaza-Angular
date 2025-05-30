import { Component, OnInit } from '@angular/core';
import { ClubsComponent } from './clubs/clubs.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ClubOverviewData, ClubItem } from './club-overview.resolver';

@Component({
  selector: 'app-club-overview',
  imports: [ClubsComponent, CommonModule, MatIconModule],
  templateUrl: './club-overview.component.html',
  styleUrl: './club-overview.component.scss',
  standalone: true
})
export class ClubOverviewComponent implements OnInit {
  footballClubsValue!: number;
  iceHockeyClubsValue!: number;
  basketballClubsValue!: number;
  rugbyClubsValue!: number;
  clubs: ClubItem[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      this.footballClubsValue = data.footballClubsValue;
      this.iceHockeyClubsValue = data.iceHockeyClubsValue;
      this.basketballClubsValue = data.basketballClubsValue;
      this.rugbyClubsValue = data.rugbyClubsValue;
      this.clubs = data.clubs;
    });
  }
}
