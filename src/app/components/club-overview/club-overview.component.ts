import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ClubOverviewData, ClubItem } from './club-overview.resolver';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ClubOverviewService } from '../../services/club-overview.service';
import { environment } from '../../../environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-club-overview',
  imports: [
    CommonModule, 
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    RouterModule
  ],
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

  // Club table properties
  displayedColumns: string[] = ['user', 'owner', 'subscriptionDate', 'subscription', 'actions'];
  dataSource: MatTableDataSource<ClubItem>;
  searchValue = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pagedData: ClubItem[] = [];
  totalCount = 0;
  
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private clubOverviewService: ClubOverviewService
  ) {
    this.dataSource = new MatTableDataSource<ClubItem>([]);
  }

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
        this.loadClubs();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  setActiveTab(sportId: string) {
    this.activeTab = sportId;
    this.currentPage = 1;
    this.loadClubs();
  }

  loadClubs() {
    const request = {
      sportId: this.activeTab,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      SearchTerm: this.searchValue
    };

    this.clubOverviewService.getClubs(request).subscribe(response => {
      if (response.success) {
        this.totalCount = response.data.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        
        this.pagedData = response.data.items.map(item => ({
          id: item.id,
          user: {
            name: item.fullName,
            avatar: item.fileUrl ? `${environment.apiUrl}/${item.fileUrl}` : 'assets/images/default-avatar.png'
          },
          owner: item.owner,
          subscriptionDate: new Date(item.subscriptionDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          subscription: item.subscriptionPlan
        }));
      }
    });
  }

  onSearch(event: Event) {
    this.searchValue = (event.target as HTMLInputElement)?.value?.trim() || '';
    this.currentPage = 1;
    this.loadClubs();
  }

  clearSearch() {
    this.searchValue = '';
    this.currentPage = 1;
    this.loadClubs();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadClubs();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadClubs();
    }
  }
}
