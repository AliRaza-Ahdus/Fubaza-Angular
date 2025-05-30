import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { StorageData } from '../dashboard.resolver';

@Component({
  selector: 'app-storage-used',
  templateUrl: './storage-used.component.html',
  styleUrls: ['./storage-used.component.scss'],
  imports: [CommonModule, NgChartsModule],
  standalone: true
})
export class StorageUsedComponent {
  @Input() storageData!: StorageData;
  
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