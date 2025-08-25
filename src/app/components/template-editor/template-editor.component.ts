import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface Template {
  id?: string;
  name: string;
  description?: string;
  type: string;
  content?: string;
  elements?: CanvasElement[];
  canvasWidth?: number;
  canvasHeight?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TemplateType {
  value: string;
  label: string;
}

interface TemplatePreset {
  id: string;
  name: string;
  thumbnail: string;
  elements: CanvasElement[];
  canvasWidth: number;
  canvasHeight: number;
}

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'button' | 'video';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  src?: string;
  alt?: string;
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  fontSize?: number;
  shape?: 'rectangle' | 'circle';
  borderRadius?: number;
}

interface Upload {
  id: string;
  name: string;
  url: string;
  type: string;
}

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class TemplateEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;
  @ViewChild('fileUpload') fileUploadRef!: ElementRef;

  template: Template = {
    name: 'Untitled Template',
    type: '',
    elements: []
  };

  templateTypes: TemplateType[] = [
    { value: 'email', label: 'Email Template' },
    { value: 'notification', label: 'Notification Template' },
    { value: 'report', label: 'Report Template' },
    { value: 'newsletter', label: 'Newsletter Template' },
    { value: 'social', label: 'Social Media Post' },
    { value: 'custom', label: 'Custom Template' }
  ];

  templatePresets: TemplatePreset[] = [
    {
      id: 'preset1',
      name: 'Email Newsletter',
      thumbnail: 'assets/images/empty-picture.jpg',
      canvasWidth: 600,
      canvasHeight: 800,
      elements: [
        {
          id: 'header1',
          type: 'text',
          x: 20,
          y: 20,
          width: 560,
          height: 60,
          content: 'Newsletter Title',
          fontFamily: 'Arial',
          fontSize: 24,
          color: '#333333'
        },
        {
          id: 'body1',
          type: 'text',
          x: 20,
          y: 100,
          width: 560,
          height: 100,
          content: 'Your newsletter content goes here. Click to edit this text.',
          fontFamily: 'Arial',
          fontSize: 14,
          color: '#555555'
        }
      ]
    },
    {
      id: 'preset2',
      name: 'Social Media Post',
      thumbnail: 'assets/images/empty-picture.jpg',
      canvasWidth: 800,
      canvasHeight: 800,
      elements: [
        {
          id: 'background1',
          type: 'shape',
          x: 0,
          y: 0,
          width: 800,
          height: 800,
          color: '#f5f5f5',
          shape: 'rectangle'
        },
        {
          id: 'headline1',
          type: 'text',
          x: 50,
          y: 50,
          width: 700,
          height: 80,
          content: 'Social Media Post Title',
          fontFamily: 'Arial',
          fontSize: 32,
          color: '#333333'
        }
      ]
    }
  ];

  // Canvas properties
  canvasWidth: number = 800;
  canvasHeight: number = 600;
  canvasElements: CanvasElement[] = [];
  selectedElement: number | null = null;
  isDragging: boolean = false;
  isResizing: boolean = false;
  resizeHandle: string = '';
  dragStartX: number = 0;
  dragStartY: number = 0;
  elementStartX: number = 0;
  elementStartY: number = 0;
  elementStartWidth: number = 0;
  elementStartHeight: number = 0;
  zoomLevel: number = 100;
  
  // History for undo/redo
  history: CanvasElement[][] = [];
  historyIndex: number = -1;
  canUndo: boolean = false;
  canRedo: boolean = false;

  // Uploads
  uploads: Upload[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize with empty canvas
    this.resetCanvas();
  }

  ngAfterViewInit(): void {
    // Setup canvas
    this.setupCanvas();
  }

  setupCanvas(): void {
    if (this.canvasRef && this.canvasRef.nativeElement) {
      const canvas = this.canvasRef.nativeElement;
      canvas.style.width = `${this.canvasWidth}px`;
      canvas.style.height = `${this.canvasHeight}px`;
    }
  }

  resetCanvas(): void {
    this.canvasElements = [];
    this.selectedElement = null;
    this.saveToHistory();
  }

  // Drag and drop operations
  onDragStart(event: DragEvent, elementType: string): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('elementType', elementType);
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer) return;

    const elementType = event.dataTransfer.getData('elementType') as 'text' | 'image' | 'shape' | 'button' | 'video';
    if (!elementType) return;

    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    this.addElementToCanvas(elementType, null, x, y);
  }

  addElementToCanvas(elementType: 'text' | 'image' | 'shape' | 'button' | 'video', data?: any, x: number = 100, y: number = 100): void {
    const newElement: CanvasElement = {
      id: `element_${Date.now()}`,
      type: elementType,
      x: x,
      y: y,
      width: 200,
      height: 100
    };

    switch (elementType) {
      case 'text':
        newElement.content = 'Click to edit text';
        newElement.fontFamily = 'Arial';
        newElement.fontSize = 16;
        newElement.color = '#000000';
        break;
      case 'image':
        if (data && data.url) {
          newElement.src = data.url;
          newElement.alt = data.name || 'Image';
        } else {
          newElement.src = 'assets/images/empty-picture.jpg';
          newElement.alt = 'Default image';
        }
        break;
      case 'shape':
        newElement.shape = 'rectangle';
        newElement.color = '#3498db';
        break;
      case 'button':
        newElement.content = 'Button';
        newElement.backgroundColor = '#4285f4';
        newElement.color = '#ffffff';
        newElement.borderRadius = 4;
        break;
      case 'video':
        newElement.src = 'https://www.example.com/sample-video.mp4';
        break;
    }

    this.canvasElements.push(newElement);
    this.selectedElement = this.canvasElements.length - 1;
    this.saveToHistory();
  }

  // Element selection and manipulation
  selectElement(index: number, event: MouseEvent): void {
    if (this.isResizing) return;
    
    event.stopPropagation();
    this.selectedElement = index;
    
    // Start drag operation
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.elementStartX = this.canvasElements[index].x;
    this.elementStartY = this.canvasElements[index].y;
  }

  startResize(index: number, handle: string, event: MouseEvent): void {
    event.stopPropagation();
    this.isResizing = true;
    this.resizeHandle = handle;
    this.selectedElement = index;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.elementStartX = this.canvasElements[index].x;
    this.elementStartY = this.canvasElements[index].y;
    this.elementStartWidth = this.canvasElements[index].width;
    this.elementStartHeight = this.canvasElements[index].height;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.selectedElement === null) return;
    
    if (this.isDragging) {
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      
      this.canvasElements[this.selectedElement].x = this.elementStartX + dx;
      this.canvasElements[this.selectedElement].y = this.elementStartY + dy;
    } else if (this.isResizing) {
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      
      const element = this.canvasElements[this.selectedElement];
      
      switch (this.resizeHandle) {
        case 'top-left':
          element.x = this.elementStartX + dx;
          element.y = this.elementStartY + dy;
          element.width = this.elementStartWidth - dx;
          element.height = this.elementStartHeight - dy;
          break;
        case 'top-right':
          element.y = this.elementStartY + dy;
          element.width = this.elementStartWidth + dx;
          element.height = this.elementStartHeight - dy;
          break;
        case 'bottom-left':
          element.x = this.elementStartX + dx;
          element.width = this.elementStartWidth - dx;
          element.height = this.elementStartHeight + dy;
          break;
        case 'bottom-right':
          element.width = this.elementStartWidth + dx;
          element.height = this.elementStartHeight + dy;
          break;
      }
      
      // Ensure minimum dimensions
      element.width = Math.max(20, element.width);
      element.height = Math.max(20, element.height);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isDragging || this.isResizing) {
      this.saveToHistory();
    }
    
    this.isDragging = false;
    this.isResizing = false;
  }

  // Update element properties
  updateElement(): void {
    // Just to trigger change detection
    this.canvasElements = [...this.canvasElements];
    this.saveToHistory();
  }

  updateElementContent(index: number, event: FocusEvent): void {
    if (this.canvasElements[index].type === 'text') {
      const target = event.target as HTMLDivElement;
      this.canvasElements[index].content = target.innerText;
      this.saveToHistory();
    }
  }

  // Canvas operations
  setCanvasSize(size: string): void {
    switch (size) {
      case 'small':
        this.canvasWidth = 600;
        this.canvasHeight = 400;
        break;
      case 'medium':
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        break;
      case 'large':
        this.canvasWidth = 1200;
        this.canvasHeight = 800;
        break;
    }
    
    this.setupCanvas();
  }

  openCustomSizeDialog(): void {
    // For simplicity, we'll just use prompt here
    // In a real app, you'd use a proper dialog component
    const width = prompt('Enter canvas width (px):', this.canvasWidth.toString());
    const height = prompt('Enter canvas height (px):', this.canvasHeight.toString());
    
    if (width && height) {
      this.canvasWidth = parseInt(width, 10);
      this.canvasHeight = parseInt(height, 10);
      this.setupCanvas();
    }
  }

  zoom(delta: number): void {
    this.zoomLevel = Math.max(10, Math.min(200, this.zoomLevel + delta));
  }

  // Element actions
  deleteElement(index: number): void {
    if (index >= 0 && index < this.canvasElements.length) {
      this.canvasElements.splice(index, 1);
      this.selectedElement = null;
      this.saveToHistory();
    }
  }

  duplicateElement(index: number): void {
    if (index >= 0 && index < this.canvasElements.length) {
      const original = this.canvasElements[index];
      const clone: CanvasElement = {
        ...JSON.parse(JSON.stringify(original)),
        id: `element_${Date.now()}`,
        x: original.x + 20,
        y: original.y + 20
      };
      
      this.canvasElements.push(clone);
      this.selectedElement = this.canvasElements.length - 1;
      this.saveToHistory();
    }
  }

  // Template operations
  loadTemplatePreset(preset: TemplatePreset): void {
    this.canvasWidth = preset.canvasWidth;
    this.canvasHeight = preset.canvasHeight;
    this.canvasElements = JSON.parse(JSON.stringify(preset.elements));
    this.template.name = preset.name;
    this.selectedElement = null;
    this.setupCanvas();
    this.saveToHistory();
  }

  previewTemplate(): void {
    // Here you would show a preview of the template
    alert('Preview functionality would be implemented here');
  }

  saveTemplate(): void {
    if (!this.template.name || !this.template.type) {
      alert('Please provide a name and type for your template');
      return;
    }
    
    // Save the current state to the template
    this.template.elements = this.canvasElements;
    this.template.canvasWidth = this.canvasWidth;
    this.template.canvasHeight = this.canvasHeight;
    this.template.updatedAt = new Date();
    
    if (!this.template.id) {
      this.template.id = `template_${Date.now()}`;
      this.template.createdAt = new Date();
    }
    
    // In a real app, you would save to a service/backend here
    console.log('Saving template:', this.template);
    
    // Navigate back or show success message
    alert('Template saved successfully');
  }

  cancelEdit(): void {
    // Navigate back to previous page
    this.router.navigate(['/dashboard']);
  }

  // File upload
  triggerUpload(): void {
    this.fileUploadRef.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    // Process each file
    Array.from(input.files).forEach(file => {
      // Only allow images for simplicity
      if (!file.type.startsWith('image/')) {
        alert('Only image files are supported');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const upload: Upload = {
            id: `upload_${Date.now()}`,
            name: file.name,
            url: e.target.result as string,
            type: file.type
          };
          
          this.uploads.push(upload);
        }
      };
      
      reader.readAsDataURL(file);
    });
    
    // Clear the input
    input.value = '';
  }

  // History management
  saveToHistory(): void {
    // Truncate history if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    // Add current state to history
    this.history.push(JSON.parse(JSON.stringify(this.canvasElements)));
    this.historyIndex = this.history.length - 1;
    
    // Update undo/redo state
    this.canUndo = this.historyIndex > 0;
    this.canRedo = false;
  }

  undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.canvasElements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.canUndo = this.historyIndex > 0;
      this.canRedo = true;
    }
  }

  redo(): void {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.canvasElements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.canUndo = true;
      this.canRedo = this.historyIndex < this.history.length - 1;
    }
  }
}
