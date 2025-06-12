import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { ClubItem } from '../club-overview.resolver';
import { ClubOverviewService } from '../../../services/club-overview.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-clubs',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.scss',
  standalone: true
})
export class ClubsComponent implements OnInit, OnChanges {
  @Input() clubCountBySport: Array<{ sportId: string; sportName: string; clubCount: number }> = [];
  @Input() activeTab: string = '';
  @Input() setActiveTab: (sportId: string) => void = () => {};
  
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
  
  constructor(private clubOverviewService: ClubOverviewService) {
    this.dataSource = new MatTableDataSource<ClubItem>([]);
  }
  
  ngOnInit(): void {
    this.loadClubs();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeTab'] && !changes['activeTab'].firstChange) {
      this.currentPage = 1;
      this.loadClubs();
    }
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
        
        // Transform the API response to match our ClubItem interface
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
