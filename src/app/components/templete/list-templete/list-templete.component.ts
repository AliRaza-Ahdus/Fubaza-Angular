import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TempleteService } from '../../../services/templete.service';
import { Sport, Templete, TempleteRequest } from '../../../models/api-response.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-templete',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './list-templete.component.html',
  styleUrls: ['./list-templete.component.scss']
})
export class ListTempleteComponent implements OnInit {
  templates: Templete[] = [];
  sports: Sport[] = [];
  selectedSportId: string = '';
  searchQuery: string = '';
  loading: boolean = false;
  
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private templeteService: TempleteService) { }

  ngOnInit(): void {
    this.loading = true;
    
    // Get sports list
    this.templeteService.getSportsList().subscribe({
      next: (response) => {
        if (response.success && response.data.length > 0) {
          this.sports = response.data;
          // Select first sport by default
          this.selectedSportId = this.sports[0].id;
          // Load templates for this sport
          this.loadTemplates();
        }
      },
      error: (error) => {
        console.error('Error fetching sports:', error);
        this.loading = false;
      }
    });
  }

  loadTemplates(): void {
    this.loading = true;
    
    const request: TempleteRequest = {
      sportId: this.selectedSportId,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchQuery
    };
    
    this.templeteService.getTempletesBySport(request).subscribe({
      next: (response) => {
        if (response.success) {
          // Store templates directly
          this.templates = response.data.items;
          this.totalCount = response.data.pagination.totalCount;
        } else {
          this.templates = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching templates:', error);
        this.templates = [];
        this.loading = false;
      }
    });
  }

  getTemplateImageUrl(template: Templete): string {
    return template.templeteUrl ? `${environment.apiUrl}/${template.templeteUrl}` : '';
  }

  setFilter(sportId: string): void {
    this.selectedSportId = sportId;
    this.currentPage = 1; // Reset to first page when changing filter
    this.loadTemplates();
  }

  searchTemplates(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1; // Reset to first page when searching
    this.loadTemplates();
  }

  shouldShowEmptyState(): boolean {
    return !this.loading && this.templates.length === 0;
  }
}
