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

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  // Common properties
  borderRadius?: number;
  opacity?: number;
  boxShadow?: string;
  border?: string;
  rotate?: number;
  // Text specific properties
  content?: string;
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  padding?: number;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: string;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textShadow?: string;
  // Image specific properties
  src?: string;
  alt?: string;
  objectFit?: string;
  objectPosition?: string;
  filter?: string;
  // Shape specific properties
  shape?: string;
  gradient?: string;
  gradientType?: string;
  gradientAngle?: number;
  gradientStop1?: string;
  gradientStop2?: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

interface UploadItem {
  id: string;
  name: string;
  url: string;
  type: string;
  source?: 'local';
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
    { value: 'custom', label: 'Custom Template' }
  ];

  // Canvas properties
  canvasWidth: number = 800;
  canvasHeight: number = 600;
  canvasElements: CanvasElement[] = [];
  selectedElement: number | null = null;
  isDragging: boolean = false;
  isResizing: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;
  elementStartX: number = 0;
  elementStartY: number = 0;
  elementStartWidth: number = 0;
  elementStartHeight: number = 0;
  zoomLevel: number = 100;
  
  // Grid and alignment
  showGrid: boolean = false;
  snapToGrid: boolean = false;
  gridSize: number = 20;
  showAlignmentGuides: boolean = true;
  showHorizontalCenterGuide: boolean = false;
  showVerticalCenterGuide: boolean = false;
  showLeftEdgeGuide: boolean = false;
  showRightEdgeGuide: boolean = false;
  showTopEdgeGuide: boolean = false;
  showBottomEdgeGuide: boolean = false;
  
  // For uploads
  uploads: UploadItem[] = [];
  showShapeSelector: boolean = false;
  
  // Dialogs
  showCustomSizeDialog: boolean = false;
  customWidth: number = 800;
  customHeight: number = 600;
  showCropDialog: boolean = false;
  currentImageToCrop: CanvasElement | null = null;
  cropWidth: number = 200;
  cropHeight: number = 200;
  cropTop: number = 0;
  cropLeft: number = 0;
  cropAspectRatio: string = 'free';
  showShareDialog: boolean = false;
  shareLink: string = '';
  sharePermission: 'view' | 'edit' = 'view';
  showExportOptions: boolean = false;
  
  // Page management
  currentPage: number = 0;
  pages: CanvasElement[][] = [[]];
  
  // History management
  history: CanvasElement[][] = [[]];
  historyIndex: number = 0;
  canUndo: boolean = false;
  canRedo: boolean = false;
  resizeHandle: string = '';
  
  // Mobile responsiveness
  activeMobilePanel: 'sidebar' | 'canvas' | 'properties' = 'canvas';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize with empty canvas
    this.resetCanvas();
    
    // Set default panel for mobile
    this.activeMobilePanel = 'canvas';
    
    // Initialize pages
    this.pages[0] = this.canvasElements;
    
    // Add window resize listener
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }
  
  @HostListener('window:resize')
  handleWindowResize(): void {
    // On larger screens, make sure we reset mobile panel states
    if (window.innerWidth >= 768) { // 768px is our tablet breakpoint
      // No need to do anything special for desktop
    } else {
      // For mobile, if properties panel is active but no element is selected, 
      // switch to canvas
      if (this.activeMobilePanel === 'properties' && this.selectedElement === null) {
        this.activeMobilePanel = 'canvas';
      }
    }
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

  // Basic drag and drop functionality
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

    const elementType = event.dataTransfer.getData('elementType') as 'text' | 'image' | 'shape';
    if (!elementType) return;

    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    this.addElementToCanvas(elementType, null, x, y);
  }

  // Add element to canvas - core functionality
  addElementToCanvas(elementType: 'text' | 'image' | 'shape', data?: any, x: number = 100, y: number = 100): void {
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
        newElement.textAlign = 'center';
        newElement.fontWeight = 'normal';
        newElement.fontStyle = 'normal';
        newElement.textDecoration = 'none';
        newElement.backgroundColor = 'transparent';
        newElement.padding = 10;
        newElement.borderRadius = 0;
        newElement.letterSpacing = 0;
        newElement.lineHeight = 1.2;
        newElement.textTransform = 'none';
        newElement.textStrokeWidth = 0;
        newElement.textStrokeColor = '#000000';
        newElement.textShadow = 'none';
        break;
      case 'image':
        if (data && data.url) {
          newElement.src = data.url;
          newElement.alt = data.name || 'Image';
        } else {
          newElement.src = 'assets/images/empty-picture.jpg';
          newElement.alt = 'Default image';
        }
        newElement.objectFit = 'contain';
        newElement.objectPosition = 'center';
        newElement.borderRadius = 0;
        newElement.border = 'none';
        newElement.boxShadow = 'none';
        newElement.filter = 'none';
        newElement.opacity = 1;
        break;
      case 'shape':
        newElement.shape = 'rectangle';
        newElement.color = '#3498db';
        newElement.borderRadius = 0;
        newElement.border = 'none';
        newElement.boxShadow = 'none';
        newElement.opacity = 1;
        newElement.rotate = 0;
        break;
    }

    this.canvasElements.push(newElement);
    this.selectedElement = this.canvasElements.length - 1;
    this.saveToHistory();
  }

  // Element selection and manipulation
  selectElement(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedElement = index;
    
    // On mobile, automatically switch to properties panel when an element is selected
    if (window.innerWidth < 768) { // 768px is our tablet breakpoint
      this.activeMobilePanel = 'properties';
    }
    
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

  // Update element content
  updateElementContent(index: number, event: FocusEvent): void {
    if (this.canvasElements[index].type === 'text') {
      const target = event.target as HTMLDivElement;
      this.canvasElements[index].content = target.innerText;
      
      // Ensure text styling is preserved by applying any style changes made directly in the contentEditable
      const computedStyle = window.getComputedStyle(target);
      
      // Only update if user manually changed these in the contentEditable
      if (computedStyle.fontWeight === 'bold' || computedStyle.fontWeight === '700') {
        this.canvasElements[index].fontWeight = 'bold';
      }
      if (computedStyle.fontStyle === 'italic') {
        this.canvasElements[index].fontStyle = 'italic';
      }
      if (computedStyle.textDecoration.includes('underline')) {
        this.canvasElements[index].textDecoration = 'underline';
      }
      
      this.saveToHistory();
    }
  }

  // Element actions
  deleteElement(index: number): void {
    if (index >= 0 && index < this.canvasElements.length) {
      this.canvasElements.splice(index, 1);
      this.selectedElement = null;
      this.saveToHistory();
    }
  }
  
  // Duplicate an element
  duplicateElement(index: number): void {
    if (index >= 0 && index < this.canvasElements.length) {
      const original = this.canvasElements[index];
      const clone = JSON.parse(JSON.stringify(original));
      clone.id = `element_${Date.now()}`;
      clone.x = original.x + 20;
      clone.y = original.y + 20;
      
      this.canvasElements.push(clone);
      this.selectedElement = this.canvasElements.length - 1;
      this.saveToHistory();
    }
  }

  // Canvas operations
  setCanvasSize(size: string): void {
    switch (size) {
      case 'instagram':
        this.canvasWidth = 1080;
        this.canvasHeight = 1080;
        break;
      case 'facebook':
        this.canvasWidth = 1200;
        this.canvasHeight = 630;
        break;
      case 'twitter':
        this.canvasWidth = 1024;
        this.canvasHeight = 512;
        break;
      case 'story':
        this.canvasWidth = 1080;
        this.canvasHeight = 1920;
        break;
      case 'youtube':
        this.canvasWidth = 1280;
        this.canvasHeight = 720;
        break;
      case 'linkedin':
        this.canvasWidth = 1200;
        this.canvasHeight = 627;
        break;
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

  // Preview the template
  previewTemplate(): void {
    // In a real application, you might open a modal or a new tab with the preview
    alert('Template Preview - This would show a rendered version of your template');
  }

  // Simple zoom function
  zoom(delta: number): void {
    this.zoomLevel = Math.max(10, Math.min(200, this.zoomLevel + delta));
  }

  // Trigger file upload
  triggerUpload(): void {
    if (this.fileUploadRef) {
      this.fileUploadRef.nativeElement.click();
    }
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    // Process the first file
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Only image files are supported');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        const upload: UploadItem = {
          id: `upload_${Date.now()}`,
          name: file.name,
          url: e.target.result as string,
          type: file.type,
          source: 'local'
        };
        
        this.uploads.push(upload);
        
        // Add the uploaded image to canvas
        this.addElementToCanvas('image', upload);
      }
    };
    
    reader.readAsDataURL(file);
    
    // Clear the input
    input.value = '';
  }
  
  // Delete an upload
  deleteUpload(id: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering the parent click
    const index = this.uploads.findIndex(u => u.id === id);
    if (index !== -1) {
      this.uploads.splice(index, 1);
    }
  }

  // Update element properties
  updateElement(): void {
    // Just to trigger change detection
    this.canvasElements = [...this.canvasElements];
    this.saveToHistory();
  }

  // Save template
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
    
    // Show success message
    alert('Template saved successfully');
  }

  // Cancel editing
  cancelEdit(): void {
    this.router.navigate(['/dashboard']);
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
  
  // Mobile panel management
  toggleMobilePanel(panel: 'sidebar' | 'canvas' | 'properties'): void {
    this.activeMobilePanel = panel;
    
    // If properties panel is selected but no element is selected, 
    // switch to canvas instead
    if (panel === 'properties' && this.selectedElement === null) {
      this.activeMobilePanel = 'canvas';
    }
  }
  
  // Text style controls
  toggleTextStyle(property: 'fontWeight' | 'fontStyle' | 'textDecoration' | 'textTransform', value: string): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    // Toggle the property on/off
    if (property === 'fontWeight') {
      element.fontWeight = element.fontWeight === value ? 'normal' : value;
    } else if (property === 'fontStyle') {
      element.fontStyle = element.fontStyle === value ? 'normal' : value;
    } else if (property === 'textDecoration') {
      element.textDecoration = element.textDecoration === value ? 'none' : value;
    }
    
    // Force update
    this.canvasElements = [...this.canvasElements];
    this.saveToHistory();
  }
  
  // Set text style (non-toggle like alignment)
  setTextStyle(property: 'textAlign', value: string): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    if (property === 'textAlign') {
      element.textAlign = value;
    }
    
    // Force update
    this.canvasElements = [...this.canvasElements];
    this.saveToHistory();
  }
  
  // Update custom shadow
  updateCustomShadow(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    const shadowColor = element.shadowColor || 'rgba(0,0,0,0.5)';
    const blur = element.shadowBlur || 5;
    const offsetX = element.shadowOffsetX || 0;
    const offsetY = element.shadowOffsetY || 5;
    
    element.boxShadow = `${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`;
    this.updateElement();
  }
  
  // Grid and alignment features
  toggleGrid(): void {
    this.showGrid = !this.showGrid;
  }
  
  toggleSnapToGrid(): void {
    this.snapToGrid = !this.snapToGrid;
    if (this.snapToGrid && !this.showGrid) {
      this.showGrid = true;
    }
  }
  
  toggleAlignmentGuides(): void {
    this.showAlignmentGuides = !this.showAlignmentGuides;
  }
  
  // Layer ordering
  bringForward(): void {
    if (this.selectedElement === null || this.selectedElement >= this.canvasElements.length - 1) return;
    
    const temp = this.canvasElements[this.selectedElement];
    this.canvasElements[this.selectedElement] = this.canvasElements[this.selectedElement + 1];
    this.canvasElements[this.selectedElement + 1] = temp;
    this.selectedElement++;
    this.saveToHistory();
  }
  
  sendBackward(): void {
    if (this.selectedElement === null || this.selectedElement <= 0) return;
    
    const temp = this.canvasElements[this.selectedElement];
    this.canvasElements[this.selectedElement] = this.canvasElements[this.selectedElement - 1];
    this.canvasElements[this.selectedElement - 1] = temp;
    this.selectedElement--;
    this.saveToHistory();
  }
  
  // Page management
  duplicatePage(): void {
    const pageCopy = JSON.parse(JSON.stringify(this.canvasElements));
    this.pages.push(pageCopy);
    this.currentPage = this.pages.length - 1;
    this.canvasElements = this.pages[this.currentPage];
    this.selectedElement = null;
    this.saveToHistory();
  }
  
  // Custom size dialog
  openCustomSizeDialog(): void {
    this.customWidth = this.canvasWidth;
    this.customHeight = this.canvasHeight;
    this.showCustomSizeDialog = true;
  }
  
  closeCustomSizeDialog(): void {
    this.showCustomSizeDialog = false;
  }
  
  selectPresetSize(preset: string): void {
    switch(preset) {
      case 'instagram':
        this.customWidth = 1080;
        this.customHeight = 1080;
        break;
      case 'facebook':
        this.customWidth = 1200;
        this.customHeight = 630;
        break;
      case 'twitter':
        this.customWidth = 1200;
        this.customHeight = 675;
        break;
      case 'story':
        this.customWidth = 1080;
        this.customHeight = 1920;
        break;
      case 'youtube':
        this.customWidth = 1280;
        this.customHeight = 720;
        break;
    }
  }
  
  applyCustomSize(): void {
    if (this.customWidth < 50) this.customWidth = 50;
    if (this.customHeight < 50) this.customHeight = 50;
    if (this.customWidth > 2000) this.customWidth = 2000;
    if (this.customHeight > 2000) this.customHeight = 2000;
    
    this.canvasWidth = this.customWidth;
    this.canvasHeight = this.customHeight;
    this.setupCanvas();
    this.closeCustomSizeDialog();
  }
  
  // Image editing functions
  cropImage(): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    this.currentImageToCrop = this.canvasElements[this.selectedElement];
    this.cropWidth = this.currentImageToCrop.width / 2;
    this.cropHeight = this.currentImageToCrop.height / 2;
    this.cropTop = this.currentImageToCrop.height / 4;
    this.cropLeft = this.currentImageToCrop.width / 4;
    this.showCropDialog = true;
  }
  
  closeCropDialog(): void {
    this.showCropDialog = false;
    this.currentImageToCrop = null;
  }
  
  startCropResize(handle: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Logic for crop resizing would go here
  }
  
  applyCropAspectRatio(): void {
    if (!this.cropAspectRatio || this.cropAspectRatio === 'free') return;
    
    const [width, height] = this.cropAspectRatio.split(':').map(Number);
    const ratio = width / height;
    
    this.cropHeight = this.cropWidth / ratio;
  }
  
  applyCrop(): void {
    // In a real implementation, this would apply cropping to the image
    // using canvas or an image processing library
    this.closeCropDialog();
  }
  
  flipImage(direction: 'horizontal' | 'vertical'): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    // In a real implementation, this would apply an actual transform to the image
    // For now, we'll just log it
    console.log(`Flipping image ${direction}`);
  }
  
  rotateImage(degrees: number): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    if (!element.rotate) element.rotate = 0;
    element.rotate = (element.rotate + degrees) % 360;
    this.updateElement();
  }
  
  toggleBackgroundRemoval(): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    // In a real app, this would call a background removal API
    console.log('Background removal requested');
  }
  
  // Export functions
  toggleExportOptions(): void {
    this.showExportOptions = !this.showExportOptions;
  }
  
  exportTemplate(format: 'png' | 'jpg' | 'pdf', quality: 'standard' | 'high'): void {
    // In a real implementation, this would convert the canvas to the requested format
    console.log(`Exporting as ${format} in ${quality} quality`);
    this.showExportOptions = false;
  }
  
  // Sharing functions
  generateShareLink(): void {
    // Generate a mock share link
    this.shareLink = `https://fubaza.com/templates/share/${Date.now()}`;
    this.sharePermission = 'view';
    this.showShareDialog = true;
    this.showExportOptions = false;
  }
  
  closeShareDialog(): void {
    this.showShareDialog = false;
  }
  
  copyShareLink(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    // Show a toast notification or some feedback
    console.log('Link copied to clipboard');
  }
  
  generateNewShareLink(): void {
    // In a real app, this would invalidate the old link and create a new one
    this.shareLink = `https://fubaza.com/templates/share/${Date.now()}`;
    console.log('New share link generated');
  }

  // Added missing method
  openShapeSelector(): void {
    this.showShapeSelector = !this.showShapeSelector;
  }
  
  updateGradient(): void {
    if (!this.selectedElement) return;
    
    const element = this.canvasElements[this.selectedElement];
    
    if (element.gradientType) {
      if (element.gradientType === 'linear') {
        const angle = element.gradientAngle || 0;
        element.color = `linear-gradient(${angle}deg, ${element.gradientStop1 || '#ffffff'}, ${element.gradientStop2 || '#000000'})`;
      } else if (element.gradientType === 'radial') {
        element.color = `radial-gradient(circle, ${element.gradientStop1 || '#ffffff'}, ${element.gradientStop2 || '#000000'})`;
      }
    }
    
    this.updateElement();
  }
  
  addShapeToCanvas(shapeType: string): void {
    const newShape: CanvasElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: (this.canvasWidth - 150) / 2,
      y: (this.canvasHeight - 150) / 2,
      width: 150,
      height: shapeType === 'circle' ? 150 : (shapeType === 'star' || shapeType === 'heart') ? 120 : 150,
      shape: shapeType,
      color: '#4c6ef5',
      opacity: 1,
      borderRadius: 0
    };
    
    this.addElementToCanvas('shape', newShape);
    this.showShapeSelector = false;
  }
}
