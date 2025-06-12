import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PlayerOverviewData, PlayerItem } from './player-overview.resolver';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PlayerOverviewService } from '../../services/player-overview.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-player-overview',
  imports: [
    CommonModule, 
    MatIconModule, 
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  templateUrl: './player-overview.component.html',
  styleUrl: './player-overview.component.scss',
  standalone: true
})
export class PlayerOverviewComponent implements OnInit {
  footballPlayersValue = 0;
  basketballPlayersValue = 0;
  iceHockeyPlayersValue = 0;
  americanFootballPlayersValue = 0;
  handballPlayersValue = 0;
  volleyballPlayersValue = 0;
  players: PlayerItem[] = [];
  playerCountBySport: Array<{ sportId: string; sportName: string; playerCount: number }> = [];
  activeTab: string = '';

  // Player table properties
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

  constructor(
    private route: ActivatedRoute,
    private playerOverviewService: PlayerOverviewService
  ) {
    this.dataSource = new MatTableDataSource<PlayerItem>([]);
  }

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      this.footballPlayersValue = data.footballPlayersValue;
      this.basketballPlayersValue = data.basketballPlayersValue;
      this.iceHockeyPlayersValue = data.iceHockeyPlayersValue;
      this.americanFootballPlayersValue = data.americanFootballPlayersValue;
      this.handballPlayersValue = data.handballPlayersValue;
      this.volleyballPlayersValue = data.volleyballPlayersValue;
      this.playerCountBySport = data.playerCountBySport || [];
      if (this.playerCountBySport.length > 0) {
        this.activeTab = this.playerCountBySport[0].sportId;
        this.loadPlayers();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  setActiveTab(sportId: string) {
    this.activeTab = sportId;
    this.currentPage = 1;
    this.loadPlayers();
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
