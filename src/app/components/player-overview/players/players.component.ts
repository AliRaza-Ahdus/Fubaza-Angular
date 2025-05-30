import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PlayerItem } from '../player-overview.resolver';

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
export class PlayersComponent implements OnInit {
  @Input() players: PlayerItem[] = [];
  
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
  
  constructor() {
    this.dataSource = new MatTableDataSource<PlayerItem>([]);
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
    this.dataSource.data = this.players;
    this.updatePagination();
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
    // You can implement filtering logic for each sport here if needed
    this.dataSource.filter = this.searchValue;
    this.currentPage = 1;
    this.updatePagination();
    this.selectedIds = [];
  }
  
  getStatusClass(status: string): string {
    if (status === 'Published') {
      return 'bg-green-100 text-green-800';
    } else if (status === 'Draft') {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-neutral-100 text-neutral-800';
    }
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
    // Deselect all if pagedData changes
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
