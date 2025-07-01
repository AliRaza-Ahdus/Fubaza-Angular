import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss']
})
export class PlayerDetailComponent implements OnInit {
  @Input() playerId!: string;
  player: any;

  // Career-section logic (Club Name, From (Year) and To (Year))
  displayedColumns: string[] = ['club', 'fromYear', 'toYear'];
  searchValue = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  pagedData: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.route.data.subscribe((data) => {
      debugger;
      const apiData = data['player'].data;
      this.player = {
        profileUrl:  apiData.images.profileUrl ? `${environment.apiUrl}/${apiData.images.profileUrl}` : 'assets/images/default-avatar.png'   ,
        fullName: apiData.fullName,
        currentClub: apiData.currentClub,
        joinedAt: apiData.joinedAt,
        gender:
          apiData.gender === null || apiData.gender === undefined || apiData.gender === ''
            ? 'Other'
            : apiData.gender === 0
            ? 'Male'
            : apiData.gender === 1
            ? 'Female'
            : 'Other',
        position: apiData.playingPositionName,
        birthdate: new Date(apiData.dateOfBirth).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        profile: `${apiData.heightCm || '-'} cm / ${apiData.weightKg || '-'} kg`,
        signedAt: apiData.signedAt ? new Date(apiData.signedAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) : '-',
        number: apiData.jerseyNumber,
        images: {
          profileUrl: apiData.images.profileUrl ? `${environment.apiUrl}/${apiData.images.profileUrl}` : 'assets/images/empty-picture.jpg',
          inMotionUrl: apiData.images.inMotionUrl ? `${environment.apiUrl}/${apiData.images.inMotionUrl}` : 'assets/images/empty-picture.jpg',
          celebrationUrl: apiData.images.celebrationUrl ? `${environment.apiUrl}/${apiData.images.celebrationUrl}` : 'assets/images/empty-picture.jpg',
          fullBodyUrl: apiData.images.fullBodyUrl ? `${environment.apiUrl}/${apiData.images.fullBodyUrl}` : 'assets/images/empty-picture.jpg',
        },
        career: (apiData.career || []).map((c: any) => ({
          clubUrl: c.clubUrl ? `${environment.apiUrl}/${c.clubUrl}` : 'assets/images/default-avatar.png',
          clubName: c.clubName,
          fromYear: c.startYear,
          toYear: c.isCurrentClub ? 'Present' : c.endYear
        }))
      };
      this.filterCareer();
    });
  }

  onSearch(event: Event) {
    this.searchValue = (event.target as HTMLInputElement)?.value?.trim() || '';
    this.filterCareer();
  }

  clearSearch() {
    this.searchValue = '';
    this.filterCareer();
  }

  filterCareer() {
    let filteredCareer: any[];
    if (!this.searchValue) {
      filteredCareer = [...this.player.career];
    } else {
      const search = this.searchValue.toLowerCase();
      filteredCareer = this.player.career.filter((item: any) =>
        item.clubName.toLowerCase().includes(search)
      );
    }
    this.currentPage = 1;
    this.updatePagination(filteredCareer);
  }

  updatePagination(filteredCareer: any[]) {
    this.totalCount = filteredCareer.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = filteredCareer.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterCareer();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterCareer();
    }
  }
} 