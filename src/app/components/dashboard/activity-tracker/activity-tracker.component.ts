import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivityItem } from '../dashboard.resolver';

@Component({
  selector: 'app-activity-tracker',
  templateUrl: './activity-tracker.component.html',
  styleUrls: ['./activity-tracker.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  standalone: true
})
export class ActivityTrackerComponent implements OnInit {
  @Input() activities: ActivityItem[] = [];
  
  displayedColumns: string[] = ['select', 'user', 'activity', 'date', 'status', 'actions'];
  dataSource: MatTableDataSource<ActivityItem>;
  activeTab = 'all';
  searchValue = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedData: ActivityItem[] = [];
  
  // Selection
  selectedIds: number[] = [];
  
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor() {
    this.dataSource = new MatTableDataSource<ActivityItem>([]);
    this.dataSource.filterPredicate = (data: ActivityItem, filter: string) => {
      const dataStr = [
        data.user.name,
        data.user.role,
        data.activity,
        data.date,
        data.status
      ].join(' ').toLowerCase();
      return dataStr.includes(filter);
    };
  }
  
  ngOnInit(): void {
    this.dataSource.data = this.activities;
    this.updatePagination();
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
    
    if (tab === 'all') {
      this.dataSource.data = this.activities;
    } else if (tab === 'posts') {
      this.dataSource.data = this.activities.filter(a => a.activity.includes('Send'));
    } else if (tab === 'stories') {
      this.dataSource.data = this.activities.filter(a => a.activity.includes('Story'));
    } else if (tab === 'more') {
      this.dataSource.data = this.activities.slice(0, 2);
    }
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