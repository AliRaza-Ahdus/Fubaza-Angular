import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TempleteService } from '../../../services/templete.service';
import { Sport } from '../../../models/api-response.model';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-addupdate-templete',
  templateUrl: './addupdate-templete.component.html',
  styleUrls: ['./addupdate-templete.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule]
})
export class AddupdateTempleteComponent implements OnInit {
  sports: Sport[] = [];
  isEditMode: boolean = false;
  templateId: string | null = null;
  imagePreview: string | null = null;
  form: FormGroup;
  loading: boolean = false;
  submitting: boolean = false;
  private baseUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templeteService: TempleteService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      sportId: ['', [Validators.required]],
      image: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    
    // Fetch sports list dynamically
    this.templeteService.getSportsList().subscribe({
      next: (res) => {
        this.sports = res.data || [];
        if (this.sports.length && !this.isEditMode) {
          this.form.patchValue({ sportId: this.sports[0].id });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching sports:', error);
        this.loading = false;
      }
    });

    // Check if we're in edit mode by looking for an ID parameter
    this.templateId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.templateId;
    if (this.isEditMode && this.templateId) {
      // Fetch template data if in edit mode
      this.loadTemplateData(this.templateId);
    }
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

  loadTemplateData(id: string): void {
    this.loading = true;
    this.templeteService.getTempleteById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const template = response.data;
          // Update form fields with the template data
          this.form.patchValue({
            title: template.title,
            sportId: template.sportId
          });
          
          // If there's an image URL, show it in the preview
          if (template.templeteUrl) {
            this.imagePreview = this.getFullImageUrl(template.templeteUrl);
            // Make image optional if we already have one
            this.form.get('image')?.setValidators(null);
            this.form.get('image')?.updateValueAndValidity();
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading template data:', error);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.form.patchValue({ image: file });
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(): void {
    // Programmatically trigger file input click
    const fileInput = document.getElementById('template-image-input');
    if (fileInput) {
      fileInput.click();
    }
  }

  saveTemplate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append('sportId', this.form.get('sportId')?.value);
    
    // Only append image if one is selected
    const imageFile = this.form.get('image')?.value;
    if (imageFile) {
      formData.append('file', imageFile);
    }
    
    // For update, include the template ID
    if (this.isEditMode && this.templateId) {
      formData.append('templeteId', this.templateId);
    }
    
    // Send the request to add or update the template
    this.http.post(`${this.baseUrl}/api/Templete/AddOrUpdatedTemplete`, formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/list-templete']);
        } else {
          console.error('Error saving template:', response.message);
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error saving template:', error);
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    // Navigate back without saving
    this.router.navigate(['/list-templete']);
  }
}
