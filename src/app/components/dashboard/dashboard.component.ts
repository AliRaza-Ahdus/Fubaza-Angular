import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityTrackerComponent } from './activity-tracker/activity-tracker.component';
import { PlatformReachComponent } from './platform-reach/platform-reach.component';
import { TrafficByPlatformComponent } from './traffic-by-platform/traffic-by-platform.component';
import { RevenueChartComponent } from './revenue-chart/revenue-chart.component';
import { StorageUsedComponent } from './storage-used/storage-used.component';
import { TemplatesComponent } from './templates/templates.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { DashboardData } from './dashboard.resolver';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    ActivityTrackerComponent,
    PlatformReachComponent,
    TrafficByPlatformComponent,
    RevenueChartComponent,
    StorageUsedComponent,
    TemplatesComponent,
    MatIconModule
  ],
  standalone: true
})
export class DashboardComponent implements OnInit {
  statsCards: DashboardData['statsCards'] = [];
  activities: DashboardData['activities'] = [];
  templates: DashboardData['templates'] = [];
  storageData: DashboardData['storageData'] = {
    pieChartData: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderWidth: 0
      }]
    }
  };
  revenueData: DashboardData['revenueData'] = {
    lineChartData: { labels: [], datasets: [] },
    periods: []
  };
  trafficData: DashboardData['trafficData'] = [];
  platformReachData: DashboardData['platformReachData'] = {
    barChartData: { labels: [], datasets: [] }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      this.statsCards = data.statsCards;
      this.activities = data.activities;
      this.templates = data.templates;
      this.storageData = data.storageData;
      this.revenueData = data.revenueData;
      this.trafficData = data.trafficData;
      this.platformReachData = data.platformReachData;
    });
  }
}