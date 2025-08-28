import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-templete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-templete.component.html',
  styleUrls: ['./list-templete.component.scss']
})
export class ListTempleteComponent implements OnInit {
  templates: any[] = [];
  filterType: string = 'all';
  searchQuery: string = '';

  constructor() { }

  ngOnInit(): void {
    this.templates = this.getMockTemplates();
    this.filterType = 'football';
  }

  setFilter(type: string): void {
    this.filterType = type;
  }

  searchTemplates(query: string): void {
    this.searchQuery = query;
  }

  filteredTemplates(): any[] {
    let result = this.templates;
    if (this.filterType !== 'all') {
      result = result.filter(template => template.type === this.filterType);
    }
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.type.toLowerCase().includes(query)
      );
    }
    return result;
  }

  shouldShowEmptyState(): boolean {
    return this.filteredTemplates().length === 0;
  }

  private getMockTemplates(): any[] {
    return [
      { id: 1, type: 'football', name: 'Football Tournament', imageUrl: 'https://i.ibb.co/30MgRpD/football-tournament.jpg', lastEdited: '2 days ago' },
      { id: 2, type: 'football', name: 'Big Match Green', imageUrl: 'https://i.ibb.co/WsHCLPt/big-match-green.jpg', lastEdited: '3 days ago' },
      { id: 3, type: 'football', name: 'Match Day', imageUrl: 'https://i.ibb.co/2qWF7LL/match-day.jpg', lastEdited: '5 days ago' },
      { id: 4, type: 'football', name: 'Game Time', imageUrl: 'https://i.ibb.co/HqNMJQT/game-time.jpg', lastEdited: '1 week ago' },
      { id: 5, type: 'rugby', name: 'Rugby Match', imageUrl: 'https://i.ibb.co/cDskndG/rugby-purple.jpg', lastEdited: '2 weeks ago' },
      { id: 6, type: 'basketball', name: 'Game Day', imageUrl: 'https://i.ibb.co/1X3R0Pv/basketball-gameday.jpg', lastEdited: '3 days ago' },
      { id: 7, type: 'football', name: 'Your Text', imageUrl: 'https://i.ibb.co/j4By9ts/your-text.jpg', lastEdited: '1 day ago' },
      { id: 8, type: 'football', name: 'Match Time', imageUrl: 'https://i.ibb.co/X7CDW5n/match-time.jpg', lastEdited: '4 days ago' }
    ];
  }
}
