import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TemplateCardComponent } from '../template-card/template-card.component';

interface Template {
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'info';
  lastUsed: string;
  image: string;
  label: string;
}

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  imports: [CommonModule, MatIconModule, TemplateCardComponent],
  standalone: true
})
export class TemplatesComponent {
  templates: Template[] = [
    {
      title: 'BIG MATCH',
      description: 'Template for major tournament matches',
      icon: 'sports_soccer',
      color: 'primary',
      lastUsed: '2 days ago',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      label: 'Recent'
    },
    {
      title: 'PLAY BALL',
      description: 'Template for friendly matches',
      icon: 'sports',
      color: 'warning',
      lastUsed: '1 week ago',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80',
      label: 'Most Popular'
    },
    {
      title: 'RED TEAM VS BLUE TEAM',
      description: 'Template for team competitions',
      icon: 'groups',
      color: 'info',
      lastUsed: '3 days ago',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      label: "User's Choice"
    }
  ];
}