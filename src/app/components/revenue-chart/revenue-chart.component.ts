import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

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
export class RevenueChartComponent implements OnInit {
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        data: [65, 70, 80, 75, 95, 90, 110, 105, 120, 125],
        label: 'Revenue',
        fill: true,
        tension: 0.4,
        borderColor: 'rgb(0, 185, 112)',
        backgroundColor: 'rgba(0, 185, 112, 0.1)',
        pointBackgroundColor: 'rgb(0, 185, 112)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(0, 185, 112)'
      }
    ]
  };
  
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
  periods: string[] = ['Current Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Year to Date', 'All Time'];
  
  ngOnInit(): void {}
}