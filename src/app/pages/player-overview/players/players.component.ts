import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface PlayerItem {
  id: number;
  player: {
    name: string;
    avatar: string;
  };
  club: string;
  position: string;
  dob: string;
  subscriptionPlan: string;
}

@Component({
  selector: 'app-players',
  imports: [MatIconModule, MatButtonModule, MatMenuModule, CommonModule, MatCheckboxModule, MatTableModule, MatSortModule],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent {
  displayedColumns: string[] = ['select', 'player', 'club', 'position', 'dob', 'subscriptionPlan', 'actions'];
  dataSource: MatTableDataSource<PlayerItem>;
  activeTab = 'football';
  searchValue = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedData: PlayerItem[] = [];
  
  // Selection
  selectedIds: number[] = [];
  
  @ViewChild(MatSort) sort!: MatSort;
  
  players: PlayerItem[] = [
    {
      id: 1,
      player: { name: 'Kimberly Mastrangelo',  avatar: 'assets/avatars/cathy.jpg' },
      club: 'Rostselmash Football Club',
      position: 'Center Back (CB)',
      dob: 'Apr 16, 2025',
      subscriptionPlan: 'Plus (Yearly)'
    },
    {
      id: 2,
      player: { name: 'David Eison', avatar: 'assets/avatars/cathy.jpg', },
      club: 'Rostselmash Football Club',
      position: 'Left Back (LB)',
      dob: 'Apr 16, 2025',
      subscriptionPlan: 'Plus (Yearly)'
    },
    {
      id: 3,
      player: { name: 'Alex Buckmaster', avatar: 'assets/avatars/cathy.jpg' },
      club: 'Rostselmash Football Club',
      position: 'Wing Back',
      dob: 'Apr 16, 2025',
      subscriptionPlan: 'Plus (Yearly)'
    },
    {
      id: 4,
      player: { name: 'Lorri Warf', avatar: 'assets/avatars/cathy.jpg' },
      club: 'Rostselmash Football Club',
      position: 'Center Forward',
      dob: 'Apr 16, 2025',
      subscriptionPlan: 'Plus (Yearly)'
    },
    {
      id: 5,
      player: { name: 'Iva Ryan', avatar: 'assets/avatars/cathy.jpg', },
      club: 'Rostselmash Football Club',
      position: 'Wide Midfield',
      dob: 'Apr 16, 2025',
      subscriptionPlan: 'Plus (Yearly)'
    },
    {
      id: 6,
      player: { name: 'Ricky Smith', avatar: 'assets/avatars/cathy.jpg', },
      club: 'Rostselmash Football Club',
      position: 'Goal Keeper',
      dob: 'Apr 16, 2025',
      subscriptionPlan: 'Plus (Yearly)'
    }
  ];
  
  constructor() {
    this.dataSource = new MatTableDataSource(this.players);
    this.dataSource.filterPredicate = (data: PlayerItem, filter: string) => {
      const dataStr = [
        data.player.name,
        data.club,
        data.position,
        data.dob,
        data.subscriptionPlan
      ].join(' ').toLowerCase();
      return dataStr.includes(filter);
    };
  }
  
  ngOnInit(): void {
    this.updatePagination();
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.dataSource.filter = this.searchValue;
    this.currentPage = 1;
    this.updatePagination();
    this.selectedIds = [];
  }
  
  onSearch(event: Event) {
    this.searchValue = (event.target as HTMLInputElement)?.value?.trim().toLowerCase() || '';
    this.dataSource.filter = this.searchValue;
    this.currentPage = 1;
    this.updatePagination();
    this.selectedIds = [];
  }

  updatePagination() {
    const filteredData = this.dataSource.filteredData;
    this.totalPages = Math.ceil(filteredData.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = filteredData.slice(start, end);
    this.selectedIds = [];
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

  toggleOne(id: number, checked: boolean) {
    if (checked) {
      this.selectedIds = [...this.selectedIds, id];
    } else {
      this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);
    }
  }
}
