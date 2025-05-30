import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { RevenueData } from '../dashboard.resolver';

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss'],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    NgChartsModule
  ],
  standalone: true
})
export class RevenueChartComponent {
  @Input() revenueData!: RevenueData;

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  selectedPeriod: string = 'Current Month';
  get periods(): string[] {
    return this.revenueData?.periods || [];
  }
}