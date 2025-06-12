import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PlayerItem } from '../player-overview.resolver';
import { PlayerOverviewService } from '../../../services/player-overview.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-players',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
  standalone: true
})
export class PlayersComponent implements OnInit, OnChanges {
  @Input() players: PlayerItem[] = [];
  @Input() playerCountBySport: Array<{ sportId: string; sportName: string; playerCount: number }> = [];
  @Input() activeTab: string = '';
  @Input() setActiveTab: (sportId: string) => void = () => {};
  
  displayedColumns: string[] = ['player', 'club', 'position', 'dob', 'subscriptionPlan', 'subscriptionDate', 'actions'];
  dataSource: MatTableDataSource<PlayerItem>;
  searchValue = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pagedData: PlayerItem[] = [];
  totalCount = 0;
  
  // Selection
  selectedIds: string[] = [];
  
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private playerOverviewService: PlayerOverviewService) {
    this.dataSource = new MatTableDataSource<PlayerItem>([]);
  }
  
  ngOnInit(): void {
    this.loadPlayers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeTab'] && !changes['activeTab'].firstChange) {
      this.currentPage = 1;
      this.loadPlayers();
    }
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadPlayers() {
    const request = {
      sportId: this.activeTab,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      SearchTerm: this.searchValue
    };

    this.playerOverviewService.getPlayers(request).subscribe(response => {
      if (response.success) {
        this.totalCount = response.data.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        
        // Transform the API response to match our PlayerItem interface
        this.pagedData = response.data.items.map(item => ({
          id: item.id,
          player: {
            name: item.fullName,
            avatar: item.fileUrl ? `${environment.apiUrl}/${item.fileUrl}` : 'assets/images/default-avatar.png'
          },
          club: item.currentClub,
          position: item.playingPosition,
          dob: new Date(item.dateOfBirth).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          subscriptionPlan: item.subscriptionPlan,
          subscriptionDate: new Date(item.subscriptionDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }));
      }
    });
  }

  onSearch(event: Event) {
    this.searchValue = (event.target as HTMLInputElement)?.value?.trim() || '';
    this.currentPage = 1;
    this.loadPlayers();
  }

  clearSearch() {
    this.searchValue = '';
    this.currentPage = 1;
    this.loadPlayers();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPlayers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPlayers();
    }
  }

  isAllSelected(): boolean {
    return this.pagedData.length > 0 && this.pagedData.every(item => this.selectedIds.includes(item.id));
  }

  toggleAll(checked: boolean) {
    if (checked) {
      this.selectedIds = this.pagedData.map(item => item.id);
    } else {
      this.selectedIds = [];
    }
  }

  toggleOne(id: string, checked: boolean) {
    if (checked) {
      this.selectedIds = [...this.selectedIds, id];
    } else {
      this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);
    }
  }
}
