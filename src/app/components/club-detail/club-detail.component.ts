import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-club-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './club-detail.component.html',
  styleUrl: './club-detail.component.scss'
})
export class ClubDetailComponent {
  activeTab: string = 'players';
  displayedColumns: string[] = ['user', 'position', 'dob', 'totalGoalScored', 'assist'];
  searchValue = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  // Players
  allMembers: any[] = [
    { avatar: 'assets/images/default-avatar.png', name: 'Kimberly Mastrangelo', position: 'Center Back (CB)', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 51 },
    { avatar: 'assets/images/default-avatar.png', name: 'David Elson', position: 'Left Back (LB)', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 0 },
    { avatar: 'assets/images/default-avatar.png', name: 'Alex Buckmaster', position: 'Wing Back', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 51 },
    { avatar: 'assets/images/default-avatar.png', name: 'Lorri Warf', position: 'Center Forward', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 0 },
    { avatar: 'assets/images/default-avatar.png', name: 'Iva Ryan', position: 'Wide Midfield', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 51 },
    { avatar: 'assets/images/default-avatar.png', name: 'Kimberly Mastrangelo', position: 'Center Back (CB)', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 51 },
    { avatar: 'assets/images/default-avatar.png', name: 'David Elson', position: 'Left Back (LB)', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 0 },
    { avatar: 'assets/images/default-avatar.png', name: 'Alex Buckmaster', position: 'Wing Back', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 51 },
    { avatar: 'assets/images/default-avatar.png', name: 'Lorri Warf', position: 'Center Forward', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 0 },
    { avatar: 'assets/images/default-avatar.png', name: 'Iva Ryan', position: 'Wide Midfield', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 51 },
    { avatar: 'assets/images/default-avatar.png', name: 'Kimberly Mastrangelo', position: 'Center Back (CB)', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 51 },
    { avatar: 'assets/images/default-avatar.png', name: 'David Elson', position: 'Left Back (LB)', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 0 },
    { avatar: 'assets/images/default-avatar.png', name: 'Alex Buckmaster', position: 'Wing Back', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 51 },
    { avatar: 'assets/images/default-avatar.png', name: 'Lorri Warf', position: 'Center Forward', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 0 },
    { avatar: 'assets/images/default-avatar.png', name: 'Iva Ryan', position: 'Wide Midfield', dob: 'Apr 16, 2025', totalGoalScored: 51, assist: 51 }
  ];
  members: any[] = [...this.allMembers];
  pagedData: any[] = [];

  // Officials
  allOfficials: any[] = [
    { avatar: 'assets/images/default-avatar.png', name: 'Kimberly Mastrangelo', designation: 'Fitness Coach', joiningDate: 'Apr 16, 2016' },
    { avatar: 'assets/images/default-avatar.png', name: 'David Elson', designation: 'Team Doctor', joiningDate: 'Apr 16, 2023' },
    { avatar: 'assets/images/default-avatar.png', name: 'Alex Buckmaster', designation: 'Goalkeeping Coach', joiningDate: 'Apr 16, 2017' },
    { avatar: 'assets/images/default-avatar.png', name: 'Lorri Warf', designation: 'Head Coach', joiningDate: 'Apr 16, 2020' },
    { avatar: 'assets/images/default-avatar.png', name: 'Iva Ryan', designation: 'Assistant Coach', joiningDate: 'Apr 16, 2025' },
    { avatar: 'assets/images/default-avatar.png', name: 'Kimberly Mastrangelo', designation: 'Fitness Coach', joiningDate: 'Apr 16, 2016' },
    { avatar: 'assets/images/default-avatar.png', name: 'David Elson', designation: 'Team Doctor', joiningDate: 'Apr 16, 2023' },
    { avatar: 'assets/images/default-avatar.png', name: 'Alex Buckmaster', designation: 'Goalkeeping Coach', joiningDate: 'Apr 16, 2017' },
    { avatar: 'assets/images/default-avatar.png', name: 'Lorri Warf', designation: 'Head Coach', joiningDate: 'Apr 16, 2020' },
    { avatar: 'assets/images/default-avatar.png', name: 'Iva Ryan', designation: 'Assistant Coach', joiningDate: 'Apr 16, 2025' },
    { avatar: 'assets/images/default-avatar.png', name: 'Kimberly Mastrangelo', designation: 'Fitness Coach', joiningDate: 'Apr 16, 2016' },
    { avatar: 'assets/images/default-avatar.png', name: 'David Elson', designation: 'Team Doctor', joiningDate: 'Apr 16, 2023' },
    { avatar: 'assets/images/default-avatar.png', name: 'Alex Buckmaster', designation: 'Goalkeeping Coach', joiningDate: 'Apr 16, 2017' },
    { avatar: 'assets/images/default-avatar.png', name: 'Lorri Warf', designation: 'Head Coach', joiningDate: 'Apr 16, 2020' },
    { avatar: 'assets/images/default-avatar.png', name: 'Iva Ryan', designation: 'Assistant Coach', joiningDate: 'Apr 16, 2025' }
  ];
  officials: any[] = [...this.allOfficials];

  // Match-day
  allMatchDays: any[] = [
    { logo: 'assets/images/default-avatar.png', opponent: 'Bayer Leverkusen', dateTime: 'Jun 3, 2025 4:02 am', location: 'Mercedes-Benz Arena, Stuttgart', referee: 'Johann Schmidt', status: 'Upcoming', score: '' },
    { logo: 'assets/images/default-avatar.png', opponent: 'Bayern Munich', dateTime: 'Jun 12, 2025 3:50 pm', location: 'Signal Iduna Park, Dortmund', referee: 'Sophie Schneider', status: 'Full Time', score: '2 - 1' },
    { logo: 'assets/images/default-avatar.png', opponent: 'Borussia Dortmund', dateTime: 'Jun 10, 2025 6:21 pm', location: 'Berlin Olympic Stadium', referee: 'Michael Braun', status: 'Upcoming', score: '' },
    { logo: 'assets/images/default-avatar.png', opponent: 'RB Leipzig', dateTime: 'Jun 9, 2025 1:03 pm', location: 'Allianz Arena, Munich', referee: 'Emilia Müller', status: 'Full Time', score: '3 - 2' },
    { logo: 'assets/images/default-avatar.png', opponent: 'VfL Wolfsburg', dateTime: 'Jun 18, 2025 7:57 pm', location: 'Volksparkstadion, Hamburg', referee: 'David Weber', status: 'Upcoming', score: '' },
    { logo: 'assets/images/default-avatar.png', opponent: 'Bayer Leverkusen', dateTime: 'Jun 3, 2025 4:02 am', location: 'Mercedes-Benz Arena, Stuttgart', referee: 'Johann Schmidt', status: 'Upcoming', score: '' },
    { logo: 'assets/images/default-avatar.png', opponent: 'Bayern Munich', dateTime: 'Jun 12, 2025 3:50 pm', location: 'Signal Iduna Park, Dortmund', referee: 'Sophie Schneider', status: 'Full Time', score: '2 - 1' },
    { logo: 'assets/images/default-avatar.png', opponent: 'Borussia Dortmund', dateTime: 'Jun 10, 2025 6:21 pm', location: 'Berlin Olympic Stadium', referee: 'Michael Braun', status: 'Upcoming', score: '' },
    { logo: 'assets/images/default-avatar.png', opponent: 'RB Leipzig', dateTime: 'Jun 9, 2025 1:03 pm', location: 'Allianz Arena, Munich', referee: 'Emilia Müller', status: 'Full Time', score: '3 - 2' },
    { logo: 'assets/images/default-avatar.png', opponent: 'VfL Wolfsburg', dateTime: 'Jun 18, 2025 7:57 pm', location: 'Volksparkstadion, Hamburg', referee: 'David Weber', status: 'Upcoming', score: '' },
    { logo: 'assets/images/default-avatar.png', opponent: 'Bayer Leverkusen', dateTime: 'Jun 3, 2025 4:02 am', location: 'Mercedes-Benz Arena, Stuttgart', referee: 'Johann Schmidt', status: 'Upcoming', score: '' },
    { logo: 'assets/images/default-avatar.png', opponent: 'Bayern Munich', dateTime: 'Jun 12, 2025 3:50 pm', location: 'Signal Iduna Park, Dortmund', referee: 'Sophie Schneider', status: 'Full Time', score: '2 - 1' },
    { logo: 'assets/images/default-avatar.png', opponent: 'Borussia Dortmund', dateTime: 'Jun 10, 2025 6:21 pm', location: 'Berlin Olympic Stadium', referee: 'Michael Braun', status: 'Upcoming', score: '' },
    { logo: 'assets/images/default-avatar.png', opponent: 'RB Leipzig', dateTime: 'Jun 9, 2025 1:03 pm', location: 'Allianz Arena, Munich', referee: 'Emilia Müller', status: 'Full Time', score: '3 - 2' },
    { logo: 'assets/images/default-avatar.png', opponent: 'VfL Wolfsburg', dateTime: 'Jun 18, 2025 7:57 pm', location: 'Volksparkstadion, Hamburg', referee: 'David Weber', status: 'Upcoming', score: '' },
  ];
  matchDays: any[] = [...this.allMatchDays];

  // Columns for each tab
  playerColumns = ['user', 'position', 'dob', 'totalGoalScored', 'assist'];
  officialColumns = ['user', 'designation', 'joiningDate'];
  matchDayColumns = ['opponent', 'dateTime', 'location', 'referee', 'status'];

  clubId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.clubId = this.route.snapshot.paramMap.get('id');
    this.updatePagination();
  }

  onSearch(event: Event) {
    this.searchValue = (event.target as HTMLInputElement)?.value?.trim() || '';
    this.filterMembers();
  }

  clearSearch() {
    this.searchValue = '';
    this.filterMembers();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.searchValue = '';
    this.currentPage = 1;
    if (tab === 'players') {
      this.displayedColumns = this.playerColumns;
      this.members = [...this.allMembers];
    } else if (tab === 'officials') {
      this.displayedColumns = this.officialColumns;
      this.members = [...this.allOfficials];
    } else if (tab === 'matchday') {
      this.displayedColumns = this.matchDayColumns;
      this.members = [...this.allMatchDays];
    }
    this.updatePagination();
  }

  filterMembers() {
    if (this.activeTab === 'players') {
      if (!this.searchValue) {
        this.members = [...this.allMembers];
      } else {
        const search = this.searchValue.toLowerCase();
        this.members = this.allMembers.filter(member =>
          member.name.toLowerCase().includes(search) ||
          member.position.toLowerCase().includes(search) ||
          member.dob.toLowerCase().includes(search)
        );
      }
    } else if (this.activeTab === 'officials') {
      if (!this.searchValue) {
        this.members = [...this.allOfficials];
      } else {
        const search = this.searchValue.toLowerCase();
        this.members = this.allOfficials.filter(official =>
          official.name.toLowerCase().includes(search) ||
          official.designation.toLowerCase().includes(search) ||
          official.joiningDate.toLowerCase().includes(search)
        );
      }
    } else if (this.activeTab === 'matchday') {
      if (!this.searchValue) {
        this.members = [...this.allMatchDays];
      } else {
        const search = this.searchValue.toLowerCase();
        this.members = this.allMatchDays.filter(match =>
          match.opponent.toLowerCase().includes(search) ||
          match.location.toLowerCase().includes(search) ||
          match.referee.toLowerCase().includes(search)
        );
      }
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalCount = this.members.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.members.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
} 