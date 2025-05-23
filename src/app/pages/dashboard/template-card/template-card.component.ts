import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-template-card',
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.scss'],
  imports: [CommonModule, MatIconModule],
  standalone: true
})
export class TemplateCardComponent {
  @Input() template!: {
    title: string;
    description: string;
    icon: string;
    color: 'primary' | 'success' | 'warning' | 'info';
    lastUsed: string;
    image: string;
    label: string;
  };
}