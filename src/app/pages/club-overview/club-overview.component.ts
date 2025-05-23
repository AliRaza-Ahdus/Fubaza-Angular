import { Component } from '@angular/core';
import { ClubsComponent } from './clubs/clubs.component';

@Component({
  selector: 'app-club-overview',
  imports: [ClubsComponent],
  templateUrl: './club-overview.component.html',
  styleUrl: './club-overview.component.scss'
})
export class ClubOverviewComponent {

}
