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
    // Initialize any data here
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
  }
}