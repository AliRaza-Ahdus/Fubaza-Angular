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
  baseUrl = environment.apiUrl;
  
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
          // Process templates to handle image URLs
          this.templates = response.data.items.map(template => {
            if (template.templeteUrl) {
              // Ensure the URL is properly formatted by removing any duplicate slashes
              template.templeteUrl = this.getFullImageUrl(template.templeteUrl);
            }
            return template;
          });
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

  // Helper method to construct the full image URL
  getFullImageUrl(relativePath: string): string {
    // Check if URL is already absolute (starts with http)
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    // Remove leading slash from path if present
    const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    
    // Remove trailing slash from baseUrl if present
    const cleanBaseUrl = this.baseUrl.endsWith('/') 
      ? this.baseUrl.substring(0, this.baseUrl.length - 1) 
      : this.baseUrl;
    
    // Combine to create the full URL
    return `${cleanBaseUrl}/${cleanPath}`;
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
