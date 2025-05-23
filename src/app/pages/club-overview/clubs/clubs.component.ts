import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface ActivityItem {
  id: number;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  owner: string;
  subscriptionDate: string;
  subscription: string;
}


@Component({
  selector: 'app-clubs',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.scss'
})
export class ClubsComponent {

  displayedColumns: string[] = ['select', 'user', 'owner', 'subscriptionDate', 'subscription', 'actions'];
  dataSource: MatTableDataSource<ActivityItem>;
  activeTab = 'football';
  searchValue = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedData: ActivityItem[] = [];
  
  // Selection
  selectedIds: number[] = [];
  
  @ViewChild(MatSort) sort!: MatSort;
  
  activities: ActivityItem[] = [
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'assets/avatars/john.jpg',
        role: 'Club Manager'
      },
      owner: 'Autumn Phillips',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    },
    {
      id: 2,
      user: {
        name: 'Cathy Martinez',
        avatar: 'assets/avatars/cathy.jpg',
        role: 'Team Coach'
      },
      owner: 'Rodger Struck',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Pro (Monthly)'
    },
    {
      id: 3,
      user: {
        name: 'Joshua Jones',
        avatar: 'assets/avatars/joshua.jpg',
        role: 'Club Admin'
      },
      owner: 'Patricia Sanders',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    },
    {
      id: 4,
      user: {
        name: 'Maria Williams',
        avatar: 'assets/avatars/maria.jpg',
        role: 'Team Manager'
      },
      owner: 'Joshua Jones',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    },
    {
      id: 5,
      user: {
        name: 'Adam Taylor',
        avatar: 'assets/avatars/adam.jpg',
        role: 'Club Admin'
      },
      owner: 'Katie Sims',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Pro (Monthly)'
    },
    // Additional records for pagination testing
    {
      id: 6,
      user: {
        name: 'Olivia Rye',
        avatar: 'assets/avatars/olivia.jpg',
        role: 'Media Specialist'
      },
      owner: 'Alex Buckmaster',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    },
    {
      id: 7,
      user: {
        name: 'Liam Smith',
        avatar: 'assets/avatars/liam.jpg',
        role: 'Player'
      },
      owner: 'Samantha Lee',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Pro (Monthly)'
    },
    {
      id: 8,
      user: {
        name: 'Emma Brown',
        avatar: 'assets/avatars/emma.jpg',
        role: 'Coach'
      },
      owner: 'Michael Green',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    },
    {
      id: 9,
      user: {
        name: 'Noah Wilson',
        avatar: 'assets/avatars/noah.jpg',
        role: 'Team Manager'
      },
      owner: 'Jessica Smith',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    },
    {
      id: 10,
      user: {
        name: 'Sophia Lee',
        avatar: 'assets/avatars/sophia.jpg',
        role: 'Club Admin'
      },
      owner: 'David Clark',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Pro (Monthly)'
    },
    {
      id: 11,
      user: {
        name: 'Mason Clark',
        avatar: 'assets/avatars/mason.jpg',
        role: 'Player'
      },
      owner: 'Emily Turner',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    },
    {
      id: 12,
      user: {
        name: 'Ava Scott',
        avatar: 'assets/avatars/ava.jpg',
        role: 'Media Specialist'
      },
      owner: 'Brian Adams',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Pro (Monthly)'
    },
    {
      id: 13,
      user: {
        name: 'Ethan King',
        avatar: 'assets/avatars/ethan.jpg',
        role: 'Team Coach'
      },
      owner: 'Laura White',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    },
    {
      id: 14,
      user: {
        name: 'Isabella Green',
        avatar: 'assets/avatars/isabella.jpg',
        role: 'Club Manager'
      },
      owner: 'Chris Evans',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Pro (Monthly)'
    },
    {
      id: 15,
      user: {
        name: 'James Hall',
        avatar: 'assets/avatars/james.jpg',
        role: 'Player'
      },
      owner: 'Sarah Parker',
      subscriptionDate: 'Apr 16, 2025',
      subscription: 'Plus (Yearly)'
    }
  ];
  
  constructor() {
    this.dataSource = new MatTableDataSource(this.activities);
    this.dataSource.filterPredicate = (data: ActivityItem, filter: string) => {
      const dataStr = [
        data.user.name,
        data.user.role,
        data.owner,
        data.subscriptionDate,
        data.subscription
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
