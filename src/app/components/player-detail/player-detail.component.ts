import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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

  // Career-section logic (Club Name, Games, Goals, Assists)
  displayedColumns: string[] = ['club', 'games', 'goals', 'assists'];
  searchValue = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  // Career data
  allCareer: any[] = [
    { logo: 'https://randomuser.me/api/portraits/men/32.jpg', club: 'Bayern Munich', games: 4, goals: 21, assists: 11 },
    { logo: 'https://randomuser.me/api/portraits/men/33.jpg', club: 'VfL Wolfsburg', games: 6, goals: 21, assists: 11 },
    { logo: 'https://randomuser.me/api/portraits/men/34.jpg', club: 'RB Leipzig', games: 3, goals: 21, assists: 11 },
    { logo: 'https://randomuser.me/api/portraits/men/35.jpg', club: 'Borussia Dortmund', games: 1, goals: 21, assists: 11 },
    { logo: 'https://randomuser.me/api/portraits/men/36.jpg', club: 'Bayer 04 Leverkusen', games: 5, goals: 21, assists: 11 },
    { logo: 'https://randomuser.me/api/portraits/men/37.jpg', club: 'Eintracht Frankfurt', games: 2, goals: 21, assists: 11 }
  ];
  career: any[] = [...this.allCareer];
  pagedData: any[] = [];

  ngOnInit() {
    // Player detail mock data
    this.player = {
      avatar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=facearea&w=256&q=80',
      name: 'Kimberly Mastrangelo',
      club: 'Rostselmash Football Club',
      position: 'Center Back (CB)',
      birthdate: '14 April, 1998',
      profile: '178cm / 73 kg',
      signedAt: '14 April, 2025',
      number: 7,
      images: [
        { url: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&w=800&q=80', label: 'In Motion' },
        { url: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&w=800&q=80', label: 'Celebration' },
        { url: 'https://images.pexels.com/photos/2744222/pexels-photo-2744222.jpeg?auto=compress&w=800&q=80', label: 'Full Body' }
      ]
    };
    this.updatePagination();
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
    if (!this.searchValue) {
      this.career = [...this.allCareer];
    } else {
      const search = this.searchValue.toLowerCase();
      this.career = this.allCareer.filter(item =>
        item.club.toLowerCase().includes(search)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalCount = this.career.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.career.slice(start, end);
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