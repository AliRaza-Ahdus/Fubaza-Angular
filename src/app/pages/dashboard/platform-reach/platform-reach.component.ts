import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { PlatformReachData } from '../dashboard.resolver';

@Component({
  selector: 'app-platform-reach',
  templateUrl: './platform-reach.component.html',
  styleUrls: ['./platform-reach.component.scss'],
  imports: [CommonModule, NgChartsModule],
  standalone: true
})
export class PlatformReachComponent {
  @Input() platformReachData!: PlatformReachData;

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12
          },
          color: '#64748B'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12
          },
          color: '#64748B',
          callback: (value) => `${value}K`
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1E293B',
        bodyColor: '#64748B',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => `${context.parsed.y}K users`
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };
}