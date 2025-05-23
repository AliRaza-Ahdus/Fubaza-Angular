import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

export interface ActivityItem {
  id: number;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  activity: string;
  date: string;
  status: string;
}

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
    MatMenuModule
  ],
  standalone: true
})
export class ActivityTrackerComponent implements OnInit {
  displayedColumns: string[] = ['user', 'activity', 'date', 'status', 'actions'];
  dataSource: MatTableDataSource<ActivityItem>;
  activeTab = 'all';
  searchValue = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedData: ActivityItem[] = [];
  
  @ViewChild(MatSort) sort!: MatSort;
  
  activities: ActivityItem[] = [
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'assets/avatars/john.jpg',
        role: 'Club Manager'
      },
      activity: 'Big WIN! Send Final (Facebook, Instagram)',
      date: 'Apr 27, 2025',
      status: 'Published'
    },
    {
      id: 2,
      user: {
        name: 'Cathy Martinez',
        avatar: 'assets/avatars/cathy.jpg',
        role: 'Team Coach'
      },
      activity: 'Big WIN! Send Final (Facebook, Instagram)',
      date: 'Apr 27, 2025',
      status: 'Draft'
    },
    {
      id: 3,
      user: {
        name: 'Joshua Jones',
        avatar: 'assets/avatars/joshua.jpg',
        role: 'Club Admin'
      },
      activity: 'Big WIN! Send Final (Facebook, Instagram)',
      date: 'Apr 27, 2025',
      status: 'Published'
    },
    {
      id: 4,
      user: {
        name: 'Maria Williams',
        avatar: 'assets/avatars/maria.jpg',
        role: 'Team Manager'
      },
      activity: 'Big WIN! Send Final (Facebook, Instagram)',
      date: 'Apr 27, 2025',
      status: 'Draft'
    },
    {
      id: 5,
      user: {
        name: 'Adam Taylor',
        avatar: 'assets/avatars/adam.jpg',
        role: 'Club Admin'
      },
      activity: 'Big WIN! Send Final (Facebook, Instagram)',
      date: 'Apr 27, 2025',
      status: 'Published'
    },
    // Additional records for pagination testing
    {
      id: 6,
      user: {
        name: 'Olivia Rye',
        avatar: 'assets/avatars/olivia.jpg',
        role: 'Media Specialist'
      },
      activity: 'Uploaded new team photos',
      date: 'Apr 28, 2025',
      status: 'Published'
    },
    {
      id: 7,
      user: {
        name: 'Liam Smith',
        avatar: 'assets/avatars/liam.jpg',
        role: 'Player'
      },
      activity: 'Updated player profile',
      date: 'Apr 29, 2025',
      status: 'Draft'
    },
    {
      id: 8,
      user: {
        name: 'Emma Brown',
        avatar: 'assets/avatars/emma.jpg',
        role: 'Coach'
      },
      activity: 'Shared training schedule',
      date: 'Apr 30, 2025',
      status: 'Published'
    },
    {
      id: 9,
      user: {
        name: 'Noah Wilson',
        avatar: 'assets/avatars/noah.jpg',
        role: 'Team Manager'
      },
      activity: 'Added new player to roster',
      date: 'May 1, 2025',
      status: 'Draft'
    },
    {
      id: 10,
      user: {
        name: 'Sophia Lee',
        avatar: 'assets/avatars/sophia.jpg',
        role: 'Club Admin'
      },
      activity: 'Scheduled friendly match',
      date: 'May 2, 2025',
      status: 'Published'
    },
    {
      id: 11,
      user: {
        name: 'Mason Clark',
        avatar: 'assets/avatars/mason.jpg',
        role: 'Player'
      },
      activity: 'Updated medical records',
      date: 'May 3, 2025',
      status: 'Draft'
    },
    {
      id: 12,
      user: {
        name: 'Ava Scott',
        avatar: 'assets/avatars/ava.jpg',
        role: 'Media Specialist'
      },
      activity: 'Published event highlights',
      date: 'May 4, 2025',
      status: 'Published'
    },
    {
      id: 13,
      user: {
        name: 'Ethan King',
        avatar: 'assets/avatars/ethan.jpg',
        role: 'Team Coach'
      },
      activity: 'Reviewed match analytics',
      date: 'May 5, 2025',
      status: 'Draft'
    },
    {
      id: 14,
      user: {
        name: 'Isabella Green',
        avatar: 'assets/avatars/isabella.jpg',
        role: 'Club Manager'
      },
      activity: 'Sent out newsletter',
      date: 'May 6, 2025',
      status: 'Published'
    },
    {
      id: 15,
      user: {
        name: 'James Hall',
        avatar: 'assets/avatars/james.jpg',
        role: 'Player'
      },
      activity: 'Completed fitness test',
      date: 'May 7, 2025',
      status: 'Draft'
    }
  ];
  
  constructor() {
    this.dataSource = new MatTableDataSource(this.activities);
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
  }

  updatePagination() {
    const filteredData = this.dataSource.filteredData;
    this.totalPages = Math.ceil(filteredData.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = filteredData.slice(start, end);
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