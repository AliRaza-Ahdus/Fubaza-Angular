import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
  imports: [CommonModule, MatIconModule],
  standalone: true
})
export class StatsCardComponent {
  @Input() title!: string;
  @Input() value!: string;
  @Input() change!: number;
  @Input() changeText!: string;
  @Input() isPositive: boolean = true;
}