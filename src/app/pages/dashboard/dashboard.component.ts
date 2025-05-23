import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityTrackerComponent } from './activity-tracker/activity-tracker.component';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { PlatformReachComponent } from './platform-reach/platform-reach.component';
import { TrafficByPlatformComponent } from './traffic-by-platform/traffic-by-platform.component';
import { RevenueChartComponent } from './revenue-chart/revenue-chart.component';
import { StorageUsedComponent } from './storage-used/storage-used.component';
import { TemplatesComponent } from './templates/templates.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    ActivityTrackerComponent,
    StatsCardComponent,
    PlatformReachComponent,
    TrafficByPlatformComponent,
    RevenueChartComponent,
    StorageUsedComponent,
    TemplatesComponent
  ],
  standalone: true
})
export class DashboardComponent {
  // Stats data
  statsCards = [
    {
      title: 'Total Users',
      value: '2,420',
      change: 6,
      changeText: 'active users',
      isPositive: true
    },
    {
      title: 'Clubs',
      value: '1,210',
      change: 10,
      changeText: 'new clubs',
      isPositive: false
    },
    {
      title: 'Players',
      value: '316',
      change: 20,
      changeText: 'active players',
      isPositive: true
    }
  ];
}