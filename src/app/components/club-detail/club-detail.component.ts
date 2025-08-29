import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ClubInfoResponse } from '../../models/api-response.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-club-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './club-detail.component.html',
  styleUrl: './club-detail.component.scss'
})
export class ClubDetailComponent {
  activeTab: string = 'players';
  displayedColumns: string[] = ['user', 'position', 'dob', 'totalGoalScored', 'assist'];
  searchValue = '';

  // Club info
  club: any;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  members: any[] = [];
  officials: any[] = [];
  pagedData: any[] = [];

  // Columns for each tab
  playerColumns = ['user', 'position', 'dob', 'totalGoalScored', 'assist', 'action'];
  officialColumns = ['user', 'designation', 'joiningDate'];

  clubId: string | null = null;

  // Loader
  loadingTable = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadingTable = true; // Start loader
    this.clubId = this.route.snapshot.paramMap.get('id');
    this.route.data.subscribe(({ data }) => {
      const apiData = data.data;
      debugger;
      this.club = {
        clubUrl: apiData.clubUrl ? `${environment.apiUrl}/${apiData.clubUrl}` : 'assets/images/default-avatar.png',
        fullName: apiData.fullName,
        address: apiData.address,
        sportName: apiData.sportName,
        posts: 131,
        totalMembers: apiData.totalMembers,
        allMembers: (apiData.players || []).map((player: any) => ({
          id: player.id,
          url: player.playerUrl ? `${environment.apiUrl}/${player.playerUrl}` : 'assets/images/default-avatar.png',
          name: player.fullName,
          position: player.playingPositionName,
          dob: new Date(player.dateOfBirth).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          }),
          totalGoalScored: 51,
          assist: 51
        })),
        allOfficials: (apiData.officials || []).map((official: any) => ({
          url: official.clubOfficialUrl ? `${environment.apiUrl}/${official.clubOfficialUrl}` : 'assets/images/default-avatar.png',
          name: official.name,
          designation: official.designation,
          joiningDate: new Date(official.joiningDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          })
        }))
      };
      this.setActiveTab('players');
      this.loadingTable = false; // Stop loader after data is ready
    });
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
    this.loadingTable = true; // Start loader
    this.activeTab = tab;
    this.searchValue = '';
    this.currentPage = 1;
    if (tab === 'players') {
      this.displayedColumns = this.playerColumns;
      this.members = [...this.club.allMembers];
    } else if (tab === 'officials') {
      this.displayedColumns = this.officialColumns;
      this.members = [...this.club.allOfficials];
    }
    this.updatePagination();
    this.loadingTable = false; // Stop loader after pagination
  }

  filterMembers() {
    this.loadingTable = true; // Start loader
    if (this.activeTab === 'players') {
      if (!this.searchValue) {
        this.members = [...this.club.allMembers];
      } else {
        const search = this.searchValue.toLowerCase();
        this.members = this.club.allMembers.filter((member: any) =>
          member.name.toLowerCase().includes(search) ||
          member.position.toLowerCase().includes(search) ||
          member.dob.toLowerCase().includes(search)
        );
      }
    } else if (this.activeTab === 'officials') {
      if (!this.searchValue) {
        this.members = [...this.club.allOfficials];
      } else {
        const search = this.searchValue.toLowerCase();
        this.members = this.club.allOfficials.filter((official: any) =>
          official.name.toLowerCase().includes(search) ||
          official.designation.toLowerCase().includes(search) ||
          official.joiningDate.toLowerCase().includes(search)
        );
      }
    }
    this.currentPage = 1;
    this.updatePagination();
    this.loadingTable = false; // Stop loader after filtering
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

  getSportIconPath(): string {
    if (!this.club.sportName) return '';
    return 'assets/icons/' + this.club.sportName.toLowerCase().replace(/\s+/g, '') + '.svg';
  }

  get clubProfileUrl(): string {
    return this.club.clubUrl ? `${environment.apiUrl}/${this.club.clubUrl}` : 'assets/images/default-avatar.png';
  }
}