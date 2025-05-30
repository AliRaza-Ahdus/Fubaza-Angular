import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgChartsModule } from 'ng2-charts';
import { PlatformReachData } from '../../../components/dashboard/dashboard.resolver';

@Component({
  selector: 'app-platform-reach',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, NgChartsModule],
  templateUrl: './platform-reach.component.html',
  styleUrls: ['./platform-reach.component.scss']
})
export class PlatformReachComponent implements OnInit {
  @Input() platformReachData!: PlatformReachData;
  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor() { }

  ngOnInit(): void { }
}