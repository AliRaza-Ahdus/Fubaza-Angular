import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-storage-used',
  templateUrl: './storage-used.component.html',
  styleUrls: ['./storage-used.component.scss'],
  imports: [CommonModule, NgChartsModule],
  standalone: true
})
export class StorageUsedComponent {
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Used by Media', 'Used by Stats', 'Used by Players', 'Free'],
    datasets: [
      {
        data: [25, 20, 15, 40],
        backgroundColor: [
          '#3B82F6',  // Blue
          '#10B981',  // Green
          '#F59E0B',  // Yellow
          '#D1D5DB'   // Gray
        ],
        hoverBackgroundColor: [
          '#2563EB',
          '#059669',
          '#D97706',
          '#9CA3AF'
        ],
        borderWidth: 0
      }
    ]
  };
  
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '35%'
  };
  
  ngOnInit(): void {}
}