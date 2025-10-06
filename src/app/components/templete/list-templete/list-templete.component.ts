import { Component, OnInit, HostListener, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TempleteService } from '../../../services/templete.service';
import { Sport, Templete, TempleteRequest, TempleteType } from '../../../models/api-response.model';
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list-templete',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './list-templete.component.html',
  styleUrls: ['./list-templete.component.scss']
})
export class ListTempleteComponent implements OnInit, OnDestroy {
  templates: Templete[] = [];
  sports: Sport[] = [];
  templeteTypes: TempleteType[] = [];
  selectedSportId: string = '';
  selectedTempleteType: number | null = null; // Changed to number type
  searchQuery: string = '';
  loading: boolean = false;
  loadingMore: boolean = false;
  activeTemplateId: string | null = null;
  allLoaded: boolean = false;
  
  // For scroll tracking
  @ViewChild('scrollTracker') scrollTracker?: ElementRef;
  
  // For search debounce
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  currentPage: number = 1;
  pageSize: number = 10; // Reduced for testing
  totalCount: number = 0;
  
  // Intersection Observer for infinite scroll
  private observer: IntersectionObserver | null = null;

  constructor(private templeteService: TempleteService) {
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchQuery = searchTerm;
      this.resetList();
      this.loadTemplates();
    });
  }

  // Close active template when clicking elsewhere
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if click is outside any template card
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.template-card')) {
      this.activeTemplateId = null;
    }
  }

  ngOnInit(): void {
    this.loading = true;
    
    // Get sports list and template types
    Promise.all([
      this.templeteService.getSportsList().toPromise(),
      this.templeteService.getTempleteTypes().toPromise()
    ]).then(([sportsRes, templeteTypesRes]) => {
      if (sportsRes?.success && sportsRes.data.length > 0) {
        this.sports = sportsRes.data;
        // Select first sport by default
        this.selectedSportId = this.sports[0].id;
      }
      
      if (templeteTypesRes?.success) {
        this.templeteTypes = templeteTypesRes.data;
      }
      
      // Load templates
      this.loadTemplates();
    }).catch((error) => {
      console.error('Error fetching data:', error);
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    // Disconnect any existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Create new observer
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Element is visible, load more data
        if (!this.loading && !this.loadingMore && !this.allLoaded) {
          this.loadMoreTemplates();
        }
      }
    }, { threshold: 0.1 });

    // Start observing the element
    if (this.scrollTracker) {
      this.observer.observe(this.scrollTracker.nativeElement);
    }
  }

  ngOnDestroy(): void {
    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetList(): void {
    this.templates = [];
    this.currentPage = 1;
    this.allLoaded = false;
  }

  loadTemplates(): void {
    this.loading = true;
    this.activeTemplateId = null;
    
    const request: TempleteRequest = {
      sportId: this.selectedSportId,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchQuery
    };

    // Add templeteType filter if selected
    if (this.selectedTempleteType !== null) {
      request.templeteType = this.selectedTempleteType;
    }
    
    this.templeteService.getTempletesBySport(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.templates = response.data.items;
          this.totalCount = response.data.pagination.totalCount;
          
          // Check if all items are loaded
          this.allLoaded = this.templates.length >= this.totalCount;
          
          // Reinitialize the intersection observer since content has changed
          setTimeout(() => this.setupIntersectionObserver(), 100);
        } else {
          this.templates = [];
          this.allLoaded = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching templates:', error);
        this.templates = [];
        this.loading = false;
        this.allLoaded = true;
      }
    });
  }

  loadMoreTemplates(): void {
    if (this.allLoaded || this.loadingMore) {
      return;
    }
    
    this.loadingMore = true;
    this.currentPage++;
    
    const request: TempleteRequest = {
      sportId: this.selectedSportId,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchQuery
    };

    // Add templeteType filter if selected
    if (this.selectedTempleteType !== null) {
      request.templeteType = this.selectedTempleteType;
    }
    
    this.templeteService.getTempletesBySport(request).subscribe({
      next: (response) => {
        if (response.success && response.data.items.length > 0) {
          // Append new items to existing templates
          const newItems = response.data.items;
          this.templates = [...this.templates, ...newItems];
          
          // Check if all items are loaded
          this.allLoaded = this.templates.length >= this.totalCount;
        } else {
          this.allLoaded = true;
        }
        this.loadingMore = false;
      },
      error: (error) => {
        console.error('Error fetching more templates:', error);
        this.loadingMore = false;
        this.allLoaded = true;
      }
    });
  }

  getTemplateImageUrl(template: Templete): string {
    return template.templeteUrl ? `${environment.apiUrl}/${template.templeteUrl}` : '';
  }

  setFilter(sportId: string): void {
    if (this.selectedSportId === sportId) return;
    
    this.selectedSportId = sportId;
    this.resetList();
    this.loadTemplates();
  }

  setTempleteTypeFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.selectedTempleteType = value ? parseInt(value, 10) : null;
    this.resetList();
    this.loadTemplates();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  onTemplateHover(template: Templete): void {
    // Hover effects handled by CSS
  }

  onTemplateClick(template: Templete, event: MouseEvent): void {
    event.stopPropagation();
    
    if (this.activeTemplateId === template.id) {
      this.activeTemplateId = null;
    } else {
      this.activeTemplateId = template.id;
    }
  }

  shouldShowEmptyState(): boolean {
    return !this.loading && this.templates.length === 0;
  }
}