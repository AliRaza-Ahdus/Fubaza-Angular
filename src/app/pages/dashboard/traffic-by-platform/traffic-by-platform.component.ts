import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrafficItem {
  platform: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-traffic-by-platform',
  templateUrl: './traffic-by-platform.component.html',
  styleUrls: ['./traffic-by-platform.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class TrafficByPlatformComponent {
  trafficData: TrafficItem[] = [
    { platform: 'Instagram', value: 35, color: '#E1306C' },
    { platform: 'Facebook', value: 28, color: '#4267B2' },
    { platform: 'Twitter', value: 22, color: '#1DA1F2' },
    { platform: 'YouTube', value: 15, color: '#FF0000' }
  ];
  
  getProgressWidth(value: number): string {
    return `${value}%`;
  }
}