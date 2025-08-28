import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TempleteService } from '../../../services/templete.service';
import { Sport } from '../../../models/api-response.model';
import { MatIconModule } from '@angular/material/icon';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templeteService: TempleteService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      sportId: ['', [Validators.required]],
      image: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Fetch sports list dynamically
    this.templeteService.getSportsList().subscribe(res => {
      this.sports = res.data || [];
    });

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
    this.form.patchValue({
      name: 'Sample Template ' + id,
      sportId: this.sports.length ? this.sports[0].id : '',
      image: null
    });
    this.imagePreview = null;
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
    // Implement save/update logic here
    console.log('Saving template:', this.form.value);
    // Navigate back to templates list
    this.router.navigate(['/list-templete']);
  }

  cancel(): void {
    // Navigate back without saving
    this.router.navigate(['/list-templete']);
  }
}
