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
  footballClubsValue = 0;
  iceHockeyClubsValue = 0;
  basketballClubsValue = 0;
  rugbyClubsValue = 0;
  handballClubsValue = 0;
  volleyballClubsValue = 0;
  clubs: ClubItem[] = [
    {
      id: 1,
      user: { name: 'John Doe', avatar: 'assets/avatars/john.jpg', role: 'Club Manager' },
      owner: 'Autumn Phillips',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    },
    {
      id: 2,
      user: { name: 'Cathy Martinez', avatar: 'assets/avatars/cathy.jpg', role: 'Team Coach' },
      owner: 'Rodger Struck',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Pro (Monthly)'
    },
    // ... add more static clubs as needed
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      this.footballClubsValue = data.footballClubsValue;
      this.iceHockeyClubsValue = data.iceHockeyClubsValue;
      this.basketballClubsValue = data.basketballClubsValue;
      this.rugbyClubsValue = data.rugbyClubsValue;
      this.handballClubsValue = data.handballClubsValue;
      this.volleyballClubsValue = data.volleyballClubsValue;
      // Keep using static clubs for the table
    });
  }
}
