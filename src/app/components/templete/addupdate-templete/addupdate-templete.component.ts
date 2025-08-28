import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-addupdate-templete',
  templateUrl: './addupdate-templete.component.html',
  styleUrls: ['./addupdate-templete.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class AddupdateTempleteComponent implements OnInit {
  isEditMode: boolean = false;
  templateId: string | null = null;
  template = {
    name: '',
    license: '',
    tags: '',
    image: null as File | null
  };
  imagePreview: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode by looking for an ID parameter
    this.templateId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.templateId;
    
    if (this.isEditMode && this.templateId) {
      // Fetch template data if in edit mode
      this.loadTemplateData(this.templateId);
    }
  }

  loadTemplateData(id: string): void {
    // This would normally fetch data from a service
    // For now, we'll just mock some data
    this.template = {
      name: 'Sample Template ' + id,
      license: 'Standard License',
      tags: 'sample, template, test',
      image: null
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    this.template.image = file;
    
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
    // Implement save/update logic here
    console.log('Saving template:', this.template);
    
    // Navigate back to templates list
    this.router.navigate(['/list-templete']);
  }

  cancel(): void {
    // Navigate back without saving
    this.router.navigate(['/list-templete']);
  }
}
