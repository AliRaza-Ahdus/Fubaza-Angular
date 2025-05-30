import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficItem } from '../dashboard.resolver';

@Component({
  selector: 'app-traffic-by-platform',
  templateUrl: './traffic-by-platform.component.html',
  styleUrls: ['./traffic-by-platform.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class TrafficByPlatformComponent {
  @Input() trafficData: TrafficItem[] = [];
  
  getProgressWidth(value: number): string {
    return `${value}%`;
  }
}