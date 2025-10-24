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
  type: 'text' | 'image' | 'shape' | 'line' | 'icon' | 'group';
  x: number;
  y: number;
  width: number;
  height: number;
  
  // Layer properties
  layerName?: string;
  name?: string;
  locked?: boolean;
  hidden?: boolean;
  visible?: boolean;
  editing?: boolean;
  zIndex?: number;
  
  // Common properties
  borderRadius?: number;
  opacity?: number;
  boxShadow?: string;
  border?: string;
  rotate?: number;
  blendMode?: string;
  
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
  textOutline?: string;
  textType?: 'heading' | 'subheading' | 'body' | 'caption';
  
  // Enhanced text effects
  textGradientType?: 'none' | 'linear' | 'radial';
  textGradientColor1?: string;
  textGradientColor2?: string;
  textGradientAngle?: number;
  highlightStyle?: 'none' | 'solid' | 'marker' | 'underline' | 'box';
  highlightColor?: string;
  highlightOpacity?: number;
  textRotation?: number;
  textPath?: 'none' | 'arc' | 'circle' | 'wave';
  textPathStrength?: number;
  customShadowColor?: string;
  customShadowBlur?: number;
  customShadowX?: number;
  customShadowY?: number;
  
  // Image specific properties
  src?: string;
  alt?: string;
  objectFit?: string;
  objectPosition?: string;
  filter?: string;
  lockAspectRatio?: boolean;
  preserveTransparency?: boolean;
  
  // Image filters
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hueRotate?: number;
  blur?: number;
  sepia?: number;
  grayscale?: number;
  invert?: number;
  
  // Image masking
  maskType?: 'rectangle' | 'circle' | 'custom';
  maskFeather?: number;
  
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
  borderWidth?: number;
  borderColor?: string;
  
  // Line specific properties
  lineWidth?: number;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  startArrow?: boolean;
  endArrow?: boolean;

  // Group specific properties
  children?: string[];
}

interface CanvasBackground {
  type: 'color' | 'gradient' | 'image';
  color?: string;
  gradientType?: 'linear' | 'radial';
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
  imageUrl?: string;
  opacity?: number;
  blur?: number;
  overlayColor?: string;
  overlayOpacity?: number;
}

interface ColorPalette {
  saved: string[];
  recent: string[];
  brand: string[];
}

interface UploadItem {
  id: string;
  name: string;
  url: string;
  type: string;
  source?: 'local';
}

@Component({
  selector: 'app-editor-templete',
  templateUrl: './editor-templete.component.html',
  styleUrls: ['./editor-templete.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class EditorTempleteComponent implements OnInit, AfterViewInit {
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
  selectedElements: number[] = [];
  isDragging: boolean = false;
  isResizing: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;
  elementStartX: number = 0;
  elementStartY: number = 0;
  elementStartWidth: number = 0;
  elementStartHeight: number = 0;
  zoomLevel: number = 100;
  
  // Add a property to store the generated template JSON
  templateJsonData: any = null;
  templateJsonString: string = '';
  
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
  
  // Shape selector enhancements
  shapeSearchQuery: string = '';
  activeShapeCategory: string = 'all';
  filteredShapes: any[] = [];
  allShapes: any[] = [
    // Basic Shapes
    { type: 'rectangle', name: 'Rectangle', category: 'basic', icon: 'crop_square' },
    { type: 'circle', name: 'Circle', category: 'basic', icon: 'radio_button_unchecked' },
    { type: 'ellipse', name: 'Ellipse', category: 'basic', icon: 'radio_button_unchecked' },
    { type: 'square', name: 'Square', category: 'basic', icon: 'crop_square' },
    
    // Geometric Shapes
    { type: 'triangle', name: 'Triangle', category: 'geometric', icon: 'change_history' },
    { type: 'diamond', name: 'Diamond', category: 'geometric', icon: 'diamond' },
    { type: 'hexagon', name: 'Hexagon', category: 'geometric', icon: 'hexagon' },
    { type: 'octagon', name: 'Octagon', category: 'geometric', icon: 'stop' },
    { type: 'pentagon', name: 'Pentagon', category: 'geometric', icon: 'pentagon' },
    { type: 'star', name: 'Star', category: 'geometric', icon: 'star' },
    
    // Lines & Arrows
    { type: 'line', name: 'Line', category: 'lines', icon: 'show_chart' },
    { type: 'arrow-right', name: 'Arrow', category: 'lines', icon: 'arrow_right' },
    { type: 'arrow-left', name: 'Left Arrow', category: 'lines', icon: 'arrow_left' },
    { type: 'arrow-up', name: 'Up Arrow', category: 'lines', icon: 'arrow_up' },
    { type: 'arrow-down', name: 'Down Arrow', category: 'lines', icon: 'arrow_down' },
    { type: 'double-arrow', name: 'Double Arrow', category: 'lines', icon: 'compare_arrows' },
    
    // Special Shapes
    { type: 'heart', name: 'Heart', category: 'special', icon: 'favorite' },
    { type: 'speech-bubble', name: 'Speech Bubble', category: 'special', icon: 'chat_bubble' },
    { type: 'burst', name: 'Burst', category: 'special', icon: 'flash_on' },
    { type: 'cloud', name: 'Cloud', category: 'special', icon: 'cloud' }
  ];
  
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
  
  // Canvas background
  canvasBackground: CanvasBackground = {
    type: 'color',
    color: '#ffffff'
  };
  
  // Pan and zoom
  panX: number = 0;
  panY: number = 0;
  isPanning: boolean = false;
  panStartX: number = 0;
  panStartY: number = 0;
  
  // Rulers
  showRulers: boolean = false;
  
  // Color palette
  savedColors: string[] = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  recentColors: string[] = [];
  brandColors: string[] = [];
  activePaletteTab: 'saved' | 'recent' | 'brand' = 'saved';
  showColorPicker: boolean = false;
  pickerColor: string = '#000000';
  hexColor: string = '#000000';
  rgbColor = { r: 0, g: 0, b: 0 };
  colorOpacity: number = 1;
  
  // Enhanced canvas interactions
  showSmartGuides: boolean = true;
  snapToGuides: boolean = true;
  guideLines: { x?: number; y?: number }[] = [];
  selectionBox: { x: number; y: number; width: number; height: number } | null = null;
  multiSelectStart: { x: number; y: number } | null = null;
  isMultiSelecting: boolean = false;
  elementHoverIndex: number | null = null;
  lastSelectedElement: number | null = null;
  
  // Canvas constraints
  constrainToCanvas: boolean = false;
  
  // Clipboard functionality
  clipboardElements: CanvasElement[] = [];
  
  // Text effects
  activeTextEffectTab: 'stroke' | 'shadow' | 'gradient' | 'highlight' = 'stroke';
  
  // Image filters
  activeImageFilterTab: 'basic' | 'advanced' | 'blend' = 'basic';
  
  // View helpers
  @ViewChild('backgroundUpload') backgroundUploadRef!: ElementRef;
  
  // Enhanced drag behavior with requestAnimationFrame for smoother performance
  private dragAnimationFrame: number | null = null;
  private lastDragTime: number = 0;
  private readonly dragThrottleMs: number = 16; // ~60fps

  // Drag state tracking
  isDraggingElement: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize with empty canvas
    this.resetCanvas();
    
    // Set default panel for mobile
    this.activeMobilePanel = 'canvas';
    
    // Initialize pages
    this.pages[0] = this.canvasElements;
    
    // Initialize filtered shapes
    this.filteredShapes = [...this.allShapes];
    
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    // Prevent default behavior for our shortcuts
    const isInputFocused = event.target instanceof HTMLInputElement || 
                          event.target instanceof HTMLTextAreaElement ||
                          (event.target as HTMLElement)?.contentEditable === 'true';
    
    // Don't handle shortcuts when typing in inputs
    if (isInputFocused) return;
    
    const ctrlKey = event.ctrlKey || event.metaKey;
    const shiftKey = event.shiftKey;
    
    switch (event.key.toLowerCase()) {
      case 'z':
        if (ctrlKey && !shiftKey) {
          event.preventDefault();
          this.undo();
        } else if (ctrlKey && shiftKey) {
          event.preventDefault();
          this.redo();
        }
        break;
        
      case 'y':
        if (ctrlKey) {
          event.preventDefault();
          this.redo();
        }
        break;
        
      case 'c':
        if (ctrlKey) {
          event.preventDefault();
          this.copyElements();
        }
        break;
        
      case 'v':
        if (ctrlKey) {
          event.preventDefault();
          this.pasteElements();
        }
        break;
        
      case 'd':
        if (ctrlKey) {
          event.preventDefault();
          if (this.selectedElement !== null) {
            this.duplicateElement(this.selectedElement);
          }
        }
        break;
        
      case 'a':
        if (ctrlKey) {
          event.preventDefault();
          this.selectAllElements();
        }
        break;
        
      case 's':
        if (ctrlKey) {
          event.preventDefault();
          this.saveTemplate();
        }
        break;
        
      case 'p':
        if (ctrlKey) {
          event.preventDefault();
          this.exportAsPNG();
        }
        break;
        
      case 'g':
        if (ctrlKey && !shiftKey) {
          event.preventDefault();
          this.groupSelectedElements();
        } else if (ctrlKey && shiftKey) {
          event.preventDefault();
          this.ungroupSelectedElements();
        }
        break;
        
      case '0':
        if (ctrlKey) {
          event.preventDefault();
          this.fitToScreen();
        }
        break;
        
      case '=':
      case '+':
        if (ctrlKey) {
          event.preventDefault();
          this.zoomIn();
        }
        break;
        
      case '-':
        if (ctrlKey) {
          event.preventDefault();
          this.zoomOut();
        }
        break;
        
      case 'delete':
      case 'backspace':
        if (this.selectedElement !== null) {
          event.preventDefault();
          this.deleteElement(this.selectedElement);
        }
        break;
        
      case 'arrowup':
        event.preventDefault();
        this.moveElement(0, shiftKey ? -10 : -1);
        break;
        
      case 'arrowdown':
        event.preventDefault();
        this.moveElement(0, shiftKey ? 10 : 1);
        break;
        
      case 'arrowleft':
        event.preventDefault();
        this.moveElement(shiftKey ? -10 : -1, 0);
        break;
        
      case 'arrowright':
        event.preventDefault();
        this.moveElement(shiftKey ? 10 : 1, 0);
        break;
    }
  }

  ngAfterViewInit(): void {
    // Setup canvas
    this.setupCanvas();
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

  // Text element addition
  addTextElement(textType: 'heading' | 'subheading' | 'body' | 'caption'): void {
    this.addElementToCanvas('text', { textType });
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
    this.selectedElements = [];
    this.selectionBox = null;
    this.multiSelectStart = null;
    this.isMultiSelecting = false;
    this.guideLines = [];
    this.saveToHistory();
  }

  // Basic drag and drop functionality
  onDragStart(event: DragEvent, elementType: string, data?: any): void {
    this.isDraggingElement = true;
    if (event.dataTransfer) {
      event.dataTransfer.setData('elementType', elementType);
      if (data) {
        event.dataTransfer.setData('elementData', JSON.stringify(data));
      }
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  onDragEnd(): void {
    this.isDraggingElement = false;
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
    
    if (!this.canvasRef || !this.canvasRef.nativeElement) {
      console.warn('Canvas reference not available');
      return;
    }

    const elementType = event.dataTransfer.getData('elementType') as 'text' | 'image' | 'shape' | 'line' | 'icon';
    if (!elementType) return;

    const elementDataString = event.dataTransfer.getData('elementData');
    let elementData = null;
    if (elementDataString) {
      try {
        elementData = JSON.parse(elementDataString);
      } catch (e) {
        console.warn('Failed to parse element data:', e);
      }
    }

    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    
    // Calculate position relative to canvas, accounting for zoom and pan transforms
    const rawX = event.clientX - canvasRect.left;
    const rawY = event.clientY - canvasRect.top;
    
    // Account for zoom level and pan transforms
    const scale = this.zoomLevel / 100;
    const x = (rawX / scale) - (this.panX / scale);
    const y = (rawY / scale) - (this.panY / scale);

    this.addElementToCanvas(elementType, elementData, x, y);
  }

  // Add element to canvas - core functionality
  addElementToCanvas(elementType: 'text' | 'image' | 'shape' | 'line' | 'icon', data?: any, x: number = 100, y: number = 100): void {
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
        // Handle different text types from drag data
        if (data && data.textType) {
          const textDefaults = {
            heading: { fontSize: 32, fontWeight: 'bold', content: 'Heading Text' },
            subheading: { fontSize: 24, fontWeight: '600', content: 'Subheading Text' },
            body: { fontSize: 16, fontWeight: 'normal', content: 'Body text content' },
            caption: { fontSize: 12, fontWeight: 'normal', content: 'Caption text' }
          };
          const defaults = textDefaults[data.textType as keyof typeof textDefaults] || textDefaults.body;
          newElement.content = defaults.content;
          newElement.fontSize = defaults.fontSize;
          newElement.fontWeight = defaults.fontWeight;
          newElement.textType = data.textType;
        } else {
          newElement.content = 'Click to edit text';
          newElement.fontSize = 16;
          newElement.fontWeight = 'normal';
        }
        
        newElement.fontFamily = 'Arial, sans-serif';
        newElement.color = '#000000';
        newElement.textAlign = 'left';
        newElement.fontStyle = 'normal';
        newElement.textDecoration = 'none';
        newElement.backgroundColor = 'transparent';
        newElement.padding = 5;
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
        
      case 'line':
        newElement.width = 200;
        newElement.height = 2;
        newElement.color = '#000000';
        newElement.lineWidth = 2;
        newElement.lineStyle = 'solid';
        newElement.startArrow = false;
        newElement.endArrow = false;
        break;
        
      case 'icon':
        newElement.width = 48;
        newElement.height = 48;
        newElement.src = 'assets/icons/default-icon.svg';
        newElement.color = '#000000';
        break;
    }

    this.canvasElements.push(newElement);
    this.selectedElement = this.canvasElements.length - 1;
    this.saveToHistory();
  }

  // Add shape to canvas - specialized method for shapes
  addShapeToCanvas(shapeType: string): void {
    const newElement: CanvasElement = {
      id: `element_${Date.now()}`,
      type: 'shape',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      shape: shapeType,
      color: '#3498db',
      borderRadius: 0,
      border: 'none',
      boxShadow: 'none',
      opacity: 1,
      rotate: 0
    };

    // Customize based on shape type
    switch (shapeType) {
      case 'circle':
        newElement.width = 150;
        newElement.height = 150;
        break;
      case 'triangle':
        newElement.width = 200;
        newElement.height = 150;
        break;
      case 'hexagon':
        newElement.width = 180;
        newElement.height = 180;
        break;
      case 'octagon':
        newElement.width = 180;
        newElement.height = 180;
        break;
      case 'pentagon':
        newElement.width = 180;
        newElement.height = 180;
        break;
      case 'star':
        newElement.width = 180;
        newElement.height = 180;
        break;
      case 'line':
        newElement.width = 200;
        newElement.height = 2;
        newElement.color = '#000000';
        newElement.lineWidth = 2;
        newElement.lineStyle = 'solid';
        newElement.startArrow = false;
        newElement.endArrow = false;
        break;
      case 'arrow-right':
        newElement.width = 200;
        newElement.height = 50;
        break;
      case 'arrow-left':
        newElement.width = 200;
        newElement.height = 50;
        break;
      case 'arrow-up':
        newElement.width = 50;
        newElement.height = 200;
        break;
      case 'arrow-down':
        newElement.width = 50;
        newElement.height = 200;
        break;
      case 'double-arrow':
        newElement.width = 200;
        newElement.height = 50;
        break;
      case 'heart':
        newElement.width = 180;
        newElement.height = 180;
        break;
      case 'speech-bubble':
        newElement.width = 200;
        newElement.height = 150;
        break;
      case 'burst':
        newElement.width = 180;
        newElement.height = 180;
        break;
      case 'cloud':
        newElement.width = 200;
        newElement.height = 120;
        break;
      default:
        // rectangle or any other shape
        break;
    }

    this.canvasElements.push(newElement);
    this.selectedElement = this.canvasElements.length - 1;
    this.saveToHistory();
  }

  // Shape selector methods
  setActiveCategory(category: string): void {
    this.activeShapeCategory = category;
    this.filterShapes();
  }

  filterShapes(): void {
    let filtered = [...this.allShapes];
    
    // Filter by category
    if (this.activeShapeCategory !== 'all') {
      filtered = filtered.filter(shape => shape.category === this.activeShapeCategory);
    }
    
    // Filter by search query
    if (this.shapeSearchQuery.trim()) {
      const query = this.shapeSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(shape => 
        shape.name.toLowerCase().includes(query) || 
        shape.type.toLowerCase().includes(query)
      );
    }
    
    this.filteredShapes = filtered;
  }

  clearShapeSearch(): void {
    this.shapeSearchQuery = '';
    this.filterShapes();
  }

  onShapeHover(shape: any, event: MouseEvent): void {
    // Add visual feedback for shape hover
    const target = event.target as HTMLElement;
    target.style.transform = 'scale(1.05)';
  }

  onShapeLeave(): void {
    // Reset hover effects
    const hoveredElements = document.querySelectorAll('.shape-option:hover');
    hoveredElements.forEach(el => {
      (el as HTMLElement).style.transform = '';
    });
  }

  getShapeIcon(shapeType: string): string {
    const shape = this.allShapes.find(s => s.type === shapeType);
    return shape ? shape.icon : 'crop_square';
  }

  getShapeIconClass(shapeType: string): string {
    // Return CSS class for shape icon styling
    return `shape-icon-${shapeType}`;
  }

  getShapeVisualClass(shapeType: string): string {
    // Return CSS class for shape visual preview
    return `shape-visual-${shapeType}`;
  }

  trackByShape(index: number, shape: any): string {
    return shape.type;
  }

  // Canvas click handler for selection box
  onCanvasClick(event: MouseEvent): void {
    // Only start selection box if clicking on empty canvas area
    if (event.target === event.currentTarget) {
      // Clear selection if not holding Ctrl
      if (!event.ctrlKey && !event.metaKey) {
        this.selectedElement = null;
        this.selectedElements = [];
      }
      
      // Start selection box
      this.isMultiSelecting = true;
      this.multiSelectStart = { x: event.clientX, y: event.clientY };
      this.selectionBox = {
        x: event.clientX,
        y: event.clientY,
        width: 0,
        height: 0
      };
    }
  }

  // Element hover handlers for visual feedback
  onElementMouseEnter(index: number): void {
    this.elementHoverIndex = index;
  }

  onElementMouseLeave(): void {
    this.elementHoverIndex = null;
  }

  // Visual feedback methods
  isElementSelected(index: number): boolean {
    return this.selectedElement === index || this.selectedElements.includes(index);
  }

  isElementHovered(index: number): boolean {
    return this.elementHoverIndex === index;
  }

  getElementClasses(index: number): string {
    const classes = [];
    
    if (this.isElementSelected(index)) {
      classes.push('selected');
    }
    
    if (this.isElementHovered(index)) {
      classes.push('hovered');
    }
    
    if (this.selectedElements.length > 1 && this.selectedElements.includes(index)) {
      classes.push('multi-selected');
    }
    
    return classes.join(' ');
  }

  getSelectionBoxStyle(): any {
    if (!this.selectionBox) return {};
    
    return {
      left: `${this.selectionBox.x}px`,
      top: `${this.selectionBox.y}px`,
      width: `${this.selectionBox.width}px`,
      height: `${this.selectionBox.height}px`
    };
  }

  getGuideLineStyles(): any[] {
    return this.guideLines.map(guide => {
      if (guide.x !== undefined) {
        return {
          left: `${guide.x}px`,
          top: '0',
          width: '1px',
          height: '100%',
          backgroundColor: '#007acc'
        };
      } else if (guide.y !== undefined) {
        return {
          left: '0',
          top: `${guide.y}px`,
          width: '100%',
          height: '1px',
          backgroundColor: '#007acc'
        };
      }
      return {};
    });
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
    // Handle panning
    if (this.isPanning) {
      this.panX = event.clientX - this.panStartX;
      this.panY = event.clientY - this.panStartY;
      return;
    }

    // Handle selection box (disable when dragging)
    if (this.isMultiSelecting && this.multiSelectStart && !this.isDragging) {
      const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
      const rawCurrentX = event.clientX - canvasRect.left;
      const rawCurrentY = event.clientY - canvasRect.top;

      // Account for zoom and pan transforms
      const scale = this.zoomLevel / 100;
      const currentX = (rawCurrentX / scale) - (this.panX / scale);
      const currentY = (rawCurrentY / scale) - (this.panY / scale);
      const startX = (this.multiSelectStart.x - canvasRect.left) / scale - (this.panX / scale);
      const startY = (this.multiSelectStart.y - canvasRect.top) / scale - (this.panY / scale);

      this.selectionBox = {
        x: Math.min(startX, currentX),
        y: Math.min(startY, currentY),
        width: Math.abs(currentX - startX),
        height: Math.abs(currentY - startY)
      };
      return;
    }

    if (this.selectedElement === null && this.selectedElements.length === 0) return;

    if (this.isDragging) {
      // Throttle drag updates for smoother performance
      const currentTime = Date.now();
      if (currentTime - this.lastDragTime < this.dragThrottleMs) {
        return;
      }
      this.lastDragTime = currentTime;

      // Cancel any pending animation frame
      if (this.dragAnimationFrame) {
        cancelAnimationFrame(this.dragAnimationFrame);
      }

      // Use requestAnimationFrame for smooth drag updates
      this.dragAnimationFrame = requestAnimationFrame(() => {
        this.performDragUpdate(event);
      });
    } else if (this.isResizing && this.selectedElement !== null) {
      // Get the canvas workspace element to calculate proper coordinates
      const canvasWorkspace = document.querySelector('.canvas-workspace') as HTMLElement;
      if (!canvasWorkspace) return;

      const workspaceRect = canvasWorkspace.getBoundingClientRect();

      // Convert screen coordinates to canvas workspace coordinates
      const mouseX = event.clientX - workspaceRect.left;
      const mouseY = event.clientY - workspaceRect.top;

      // Account for zoom and pan transforms
      const scale = this.zoomLevel / 100;
      const canvasX = (mouseX / scale) - (this.panX / scale);
      const canvasY = (mouseY / scale) - (this.panY / scale);

      // Calculate the delta from the initial resize position
      const dx = canvasX - ((this.dragStartX - workspaceRect.left) / scale - (this.panX / scale));
      const dy = canvasY - ((this.dragStartY - workspaceRect.top) / scale - (this.panY / scale));

      const element = this.canvasElements[this.selectedElement];

      // Enhanced resize logic with aspect ratio constraints
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

      // Maintain aspect ratio for images if locked
      if (element.type === 'image' && element.lockAspectRatio) {
        const aspectRatio = this.elementStartWidth / this.elementStartHeight;
        if (Math.abs(dx) > Math.abs(dy)) {
          element.height = element.width / aspectRatio;
        } else {
          element.width = element.height * aspectRatio;
        }
      }

      // Ensure minimum dimensions with better constraints
      element.width = Math.max(20, element.width);
      element.height = Math.max(20, element.height);

      // Update cursor based on resize handle
      this.updateResizeCursor();
    }
  }

  // Separate drag update method for better performance
  private performDragUpdate(event: MouseEvent): void {
    // Add dragging class to selected elements for visual feedback
    if (this.selectedElements.length > 0) {
      this.selectedElements.forEach(index => {
        const element = document.querySelector(`[data-element-index="${index}"]`);
        if (element) element.classList.add('dragging');
      });
    } else if (this.selectedElement !== null) {
      const element = document.querySelector(`[data-element-index="${this.selectedElement}"]`);
      if (element) element.classList.add('dragging');
    }

    // Get the canvas workspace element to calculate proper coordinates
    const canvasWorkspace = document.querySelector('.canvas-workspace') as HTMLElement;
    if (!canvasWorkspace) return;

    const workspaceRect = canvasWorkspace.getBoundingClientRect();

    // Convert screen coordinates to canvas workspace coordinates with improved precision
    const mouseX = event.clientX - workspaceRect.left;
    const mouseY = event.clientY - workspaceRect.top;

    // Account for zoom and pan transforms with higher precision
    const scale = this.zoomLevel / 100;
    const canvasX = (mouseX / scale) - (this.panX / scale);
    const canvasY = (mouseY / scale) - (this.panY / scale);

    // Calculate the delta from the initial drag position with sub-pixel precision
    const dx = canvasX - ((this.dragStartX - workspaceRect.left) / scale - (this.panX / scale));
    const dy = canvasY - ((this.dragStartY - workspaceRect.top) / scale - (this.panY / scale));

    // Apply smooth movement with optional constraints
    let newX = this.elementStartX + dx;
    let newY = this.elementStartY + dy;

    // Apply snap-to-grid if enabled
    if (this.snapToGrid) {
      newX = Math.round(newX / this.gridSize) * this.gridSize;
      newY = Math.round(newY / this.gridSize) * this.gridSize;
    }

    // Constrain movement within canvas bounds if enabled
    if (this.constrainToCanvas) {
      const element = this.selectedElements.length > 0 ? this.canvasElements[this.selectedElements[0]] : this.canvasElements[this.selectedElement!];
      const elementWidth = element.width || 0;
      const elementHeight = element.height || 0;

      newX = Math.max(0, Math.min(newX, this.canvasWidth - elementWidth));
      newY = Math.max(0, Math.min(newY, this.canvasHeight - elementHeight));
    }

    // Calculate smart guides if enabled and only one element is selected
    if (this.showSmartGuides && this.selectedElements.length <= 1 && this.selectedElement !== null) {
      this.calculateSmartGuides(this.selectedElement, newX, newY);

      // Apply snapping if enabled
      if (this.snapToGuides) {
        const snappedPosition = this.getSnappedPosition(this.selectedElement, newX, newY);
        newX = snappedPosition.x;
        newY = snappedPosition.y;
      }
    }

    // Move selected elements with improved multi-selection handling
    if (this.selectedElements.length > 1) {
      // Multi-selection: move all selected elements relative to their original positions
      this.selectedElements.forEach(index => {
        const element = this.canvasElements[index];
        const originalDx = element.x - this.elementStartX;
        const originalDy = element.y - this.elementStartY;
        element.x = newX + originalDx;
        element.y = newY + originalDy;
      });
    } else if (this.selectedElement !== null) {
      // Single selection with smooth movement
      this.canvasElements[this.selectedElement].x = newX;
      this.canvasElements[this.selectedElement].y = newY;
    }

    // Update cursor to indicate dragging
    document.body.style.cursor = 'grabbing';
  }

  // Update cursor based on resize handle
  updateResizeCursor(): void {
    if (this.resizeHandle) {
      switch (this.resizeHandle) {
        case 'top-left':
        case 'bottom-right':
          document.body.style.cursor = 'nw-resize';
          break;
        case 'top-right':
        case 'bottom-left':
          document.body.style.cursor = 'ne-resize';
          break;
        case 'top':
        case 'bottom':
          document.body.style.cursor = 'ns-resize';
          break;
        case 'left':
        case 'right':
          document.body.style.cursor = 'ew-resize';
          break;
        default:
          document.body.style.cursor = 'default';
      }
    } else {
      document.body.style.cursor = 'default';
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    // Cancel any pending animation frame
    if (this.dragAnimationFrame) {
      cancelAnimationFrame(this.dragAnimationFrame);
      this.dragAnimationFrame = null;
    }

    // Complete selection box selection
    if (this.isMultiSelecting && this.selectionBox) {
      this.completeSelectionBox();
      this.isMultiSelecting = false;
      this.multiSelectStart = null;
      this.selectionBox = null;
      return;
    }
    
    if (this.isDragging || this.isResizing) {
      this.saveToHistory();
    }
    
    this.isDragging = false;
    this.isResizing = false;
    this.isPanning = false;
    
    // Clear smart guides when dragging ends
    this.guideLines = [];
    
    // Remove dragging class from all elements
    const draggedElements = document.querySelectorAll('.dragging');
    draggedElements.forEach(el => el.classList.remove('dragging'));
  }

  // Complete selection box and select elements within it
  completeSelectionBox(): void {
    if (!this.selectionBox) return;
    
    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    const selectionRect = {
      left: this.selectionBox.x,
      top: this.selectionBox.y,
      right: this.selectionBox.x + this.selectionBox.width,
      bottom: this.selectionBox.y + this.selectionBox.height
    };
    
    const newSelection: number[] = [];
    
    this.canvasElements.forEach((element, index) => {
      const elementRect = {
        left: element.x,
        top: element.y,
        right: element.x + (element.width || 0),
        bottom: element.y + (element.height || 0)
      };
      
      // Check if element intersects with selection box
      if (elementRect.left < selectionRect.right &&
          elementRect.right > selectionRect.left &&
          elementRect.top < selectionRect.bottom &&
          elementRect.bottom > selectionRect.top) {
        newSelection.push(index);
      }
    });
    
    // Update selection
    if (newSelection.length > 0) {
      this.selectedElements = newSelection;
      this.selectedElement = newSelection[0];
    }
  }

  // Smart guides calculation
  calculateSmartGuides(selectedIndex: number, newX: number, newY: number): void {
    if (!this.showSmartGuides) return;
    
    const selectedElement = this.canvasElements[selectedIndex];
    const tolerance = 5; // pixels tolerance for snapping
    
    this.guideLines = [];
    
    // Check alignment with other elements
    this.canvasElements.forEach((element, index) => {
      if (index === selectedIndex) return;
      
      const elementRight = element.x + (element.width || 0);
      const elementBottom = element.y + (element.height || 0);
      const selectedRight = newX + (selectedElement.width || 0);
      const selectedBottom = newY + (selectedElement.height || 0);
      
      // Horizontal alignment guides
      if (Math.abs(newX - element.x) <= tolerance) {
        this.guideLines.push({ x: element.x });
      }
      if (Math.abs(newX - elementRight) <= tolerance) {
        this.guideLines.push({ x: elementRight });
      }
      if (Math.abs(selectedRight - element.x) <= tolerance) {
        this.guideLines.push({ x: element.x });
      }
      if (Math.abs(selectedRight - elementRight) <= tolerance) {
        this.guideLines.push({ x: elementRight });
      }
      
      // Vertical alignment guides
      if (Math.abs(newY - element.y) <= tolerance) {
        this.guideLines.push({ y: element.y });
      }
      if (Math.abs(newY - elementBottom) <= tolerance) {
        this.guideLines.push({ y: elementBottom });
      }
      if (Math.abs(selectedBottom - element.y) <= tolerance) {
        this.guideLines.push({ y: element.y });
      }
      if (Math.abs(selectedBottom - elementBottom) <= tolerance) {
        this.guideLines.push({ y: elementBottom });
      }
      
      // Center alignment guides
      const elementCenterX = element.x + (element.width || 0) / 2;
      const elementCenterY = element.y + (element.height || 0) / 2;
      const selectedCenterX = newX + (selectedElement.width || 0) / 2;
      const selectedCenterY = newY + (selectedElement.height || 0) / 2;
      
      if (Math.abs(selectedCenterX - elementCenterX) <= tolerance) {
        this.guideLines.push({ x: elementCenterX });
      }
      if (Math.abs(selectedCenterY - elementCenterY) <= tolerance) {
        this.guideLines.push({ y: elementCenterY });
      }
    });
    
    // Canvas edge alignment guides
    if (Math.abs(newX - 0) <= tolerance) {
      this.guideLines.push({ x: 0 });
    }
    if (Math.abs(newX - this.canvasWidth) <= tolerance) {
      this.guideLines.push({ x: this.canvasWidth });
    }
    if (Math.abs(newY - 0) <= tolerance) {
      this.guideLines.push({ y: 0 });
    }
    if (Math.abs(newY - this.canvasHeight) <= tolerance) {
      this.guideLines.push({ y: this.canvasHeight });
    }
    
    // Canvas center guides
    const canvasCenterX = this.canvasWidth / 2;
    const canvasCenterY = this.canvasHeight / 2;
    const selectedCenterX = newX + (selectedElement.width || 0) / 2;
    const selectedCenterY = newY + (selectedElement.height || 0) / 2;
    
    if (Math.abs(selectedCenterX - canvasCenterX) <= tolerance) {
      this.guideLines.push({ x: canvasCenterX });
    }
    if (Math.abs(selectedCenterY - canvasCenterY) <= tolerance) {
      this.guideLines.push({ y: canvasCenterY });
    }
  }

  // Get snapped position based on guide lines
  getSnappedPosition(selectedIndex: number, newX: number, newY: number): { x: number; y: number } {
    const selectedElement = this.canvasElements[selectedIndex];
    const snapTolerance = 8; // pixels tolerance for snapping
    let snappedX = newX;
    let snappedY = newY;
    
    // Check for horizontal snapping
    for (const guide of this.guideLines) {
      if (guide.x !== undefined) {
        // Left edge snapping
        if (Math.abs(newX - guide.x) <= snapTolerance) {
          snappedX = guide.x;
          break;
        }
        // Right edge snapping
        const rightEdge = newX + (selectedElement.width || 0);
        if (Math.abs(rightEdge - guide.x) <= snapTolerance) {
          snappedX = guide.x - (selectedElement.width || 0);
          break;
        }
        // Center snapping
        const centerX = newX + (selectedElement.width || 0) / 2;
        if (Math.abs(centerX - guide.x) <= snapTolerance) {
          snappedX = guide.x - (selectedElement.width || 0) / 2;
          break;
        }
      }
    }
    
    // Check for vertical snapping
    for (const guide of this.guideLines) {
      if (guide.y !== undefined) {
        // Top edge snapping
        if (Math.abs(newY - guide.y) <= snapTolerance) {
          snappedY = guide.y;
          break;
        }
        // Bottom edge snapping
        const bottomEdge = newY + (selectedElement.height || 0);
        if (Math.abs(bottomEdge - guide.y) <= snapTolerance) {
          snappedY = guide.y - (selectedElement.height || 0);
          break;
        }
        // Center snapping
        const centerY = newY + (selectedElement.height || 0) / 2;
        if (Math.abs(centerY - guide.y) <= snapTolerance) {
          snappedY = guide.y - (selectedElement.height || 0) / 2;
          break;
        }
      }
    }
    
    return { x: snappedX, y: snappedY };
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
  
  // Select an element on the canvas
  selectElement(index: number, event: MouseEvent): void {
    event.stopPropagation();
    
    // If shift is held, add to multi-selection
    if (event.shiftKey) {
      if (this.selectedElements.includes(index)) {
        // Remove from selection
        this.selectedElements = this.selectedElements.filter(i => i !== index);
      } else {
        // Add to selection
        this.selectedElements.push(index);
      }
    } else {
      // Single selection - clear multi-selection
      this.selectedElements = [];
      this.selectedElement = index;
    }
    
    this.lastSelectedElement = index;
    
    // Start dragging for the selected element
    this.startElementDrag(index, event);
  }

  // Start dragging an element
  startElementDrag(index: number, event: MouseEvent): void {
    if (index < 0 || index >= this.canvasElements.length) return;
    
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.elementStartX = this.canvasElements[index].x;
    this.elementStartY = this.canvasElements[index].y;
    this.elementStartWidth = this.canvasElements[index].width;
    this.elementStartHeight = this.canvasElements[index].height;
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

  // Preview the template
  previewTemplate(): void {
    // In a real application, you might open a modal or a new tab with the preview
    alert('Template Preview - This would show a rendered version of your template');
  }

  // Simple zoom function
  zoom(delta: number): void {
    this.zoomLevel = Math.max(10, Math.min(500, this.zoomLevel + delta));
  }

  // Enhanced zoom and view controls
  setZoom(level: number): void {
    this.zoomLevel = Math.max(10, Math.min(500, level));
  }

  fitToScreen(): void {
    const workspaceRect = document.querySelector('.canvas-workspace')?.getBoundingClientRect();
    if (!workspaceRect) return;
    
    const padding = 100;
    const scaleX = (workspaceRect.width - padding) / this.canvasWidth;
    const scaleY = (workspaceRect.height - padding) / this.canvasHeight;
    const optimalScale = Math.min(scaleX, scaleY);
    
    this.zoomLevel = Math.max(10, Math.min(200, optimalScale * 100));
    this.centerCanvas();
  }

  actualSize(): void {
    this.zoomLevel = 100;
    this.centerCanvas();
  }

  centerCanvas(): void {
    this.panX = 0;
    this.panY = 0;
  }

  // Pan controls
  startPan(event: MouseEvent): void {
    if (event.button === 1 || (event.button === 0 && event.ctrlKey)) {
      this.isPanning = true;
      this.panStartX = event.clientX - this.panX;
      this.panStartY = event.clientY - this.panY;
      event.preventDefault();
    }
  }

  // Mouse wheel zoom
  onWheel(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      const zoomDelta = event.deltaY > 0 ? -10 : 10;
      this.zoom(zoomDelta);
    }
  }

  // Grid and rulers
  toggleRulers(): void {
    this.showRulers = !this.showRulers;
  }

  // Canvas background methods
  setBackgroundType(type: 'color' | 'gradient' | 'image'): void {
    this.canvasBackground.type = type;
    this.updateCanvasBackground();
  }

  updateCanvasBackground(): void {
    // This method will be called when background properties change
    // The actual styling is handled by getCanvasBackgroundStyle()
  }

  getCanvasBackgroundStyle(): string {
    switch (this.canvasBackground.type) {
      case 'color':
        return this.canvasBackground.color || '#ffffff';
        
      case 'gradient':
        if (this.canvasBackground.gradientType === 'linear') {
          return `linear-gradient(${this.canvasBackground.gradientAngle || 45}deg, ${this.canvasBackground.gradientColor1 || '#ffffff'}, ${this.canvasBackground.gradientColor2 || '#000000'})`;
        } else {
          return `radial-gradient(circle, ${this.canvasBackground.gradientColor1 || '#ffffff'}, ${this.canvasBackground.gradientColor2 || '#000000'})`;
        }
        
      case 'image':
        if (this.canvasBackground.imageUrl) {
          let style = `url('${this.canvasBackground.imageUrl}') center/cover no-repeat`;
          if (this.canvasBackground.overlayColor && this.canvasBackground.overlayOpacity) {
            const overlay = `linear-gradient(rgba(${this.hexToRgb(this.canvasBackground.overlayColor)}, ${this.canvasBackground.overlayOpacity}), rgba(${this.hexToRgb(this.canvasBackground.overlayColor)}, ${this.canvasBackground.overlayOpacity}))`;
            style = `${overlay}, ${style}`;
          }
          return style;
        }
        return '#ffffff';
        
      default:
        return '#ffffff';
    }
  }

  triggerBackgroundUpload(): void {
    if (this.backgroundUploadRef) {
      this.backgroundUploadRef.nativeElement.click();
    }
  }

  onBackgroundSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.canvasBackground.imageUrl = e.target.result as string;
        this.updateCanvasBackground();
      }
    };
    
    reader.readAsDataURL(file);
    input.value = '';
  }

  removeBackgroundImage(): void {
    this.canvasBackground.imageUrl = undefined;
    this.updateCanvasBackground();
  }

  // Helper method to convert hex to RGB
  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    return '255, 255, 255';
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
    
    // Generate the standardized JSON format for saving/exporting
    this.templateJsonData = this.generateTemplateJson();
    
    // Store the JSON in a variable (could be saved to DB in the future)
    this.templateJsonString = JSON.stringify(this.templateJsonData, null, 2);
    
    // For debugging purposes - log the JSON
    console.log('Template JSON:', this.templateJsonString);
    
    // In a real app, you would save to a service/backend here
    console.log('Saving template:', this.template);
    
    // Show success message with JSON preview
    alert(`Template saved successfully!\n\nPreview of JSON data:\n${this.templateJsonString.substring(0, 150)}...`);
    
    // Set a breakpoint here for debugging
    debugger; // This will pause execution in the browser's developer tools
  }
  
  // Save template with promise-based image conversion
  async saveTemplateWithImageConversion(): Promise<void> {
    if (!this.template.name || !this.template.type) {
      alert('Please provide a name and type for your template');
      return;
    }
    
    try {
      // Show loading indicator
      console.log('Converting images to base64...');
      
      // Pre-process all images to base64
      await this.preProcessImages();

      debugger;
      
      // Continue with regular save flow
      // Save the current state to the template
      this.template.elements = this.canvasElements;
      this.template.canvasWidth = this.canvasWidth;
      this.template.canvasHeight = this.canvasHeight;
      this.template.updatedAt = new Date();
      
      if (!this.template.id) {
        this.template.id = `template_${Date.now()}`;
        this.template.createdAt = new Date();
      }
      
      // Generate the standardized JSON format for saving/exporting
      this.templateJsonData = this.generateTemplateJson();
      
      // Store the JSON in a variable (could be saved to DB in the future)
      this.templateJsonString = JSON.stringify(this.templateJsonData, null, 2);
      
      // For debugging purposes - log the JSON
      console.log('Template JSON:', this.templateJsonString);
      
      // In a real app, you would save to a service/backend here
      console.log('Saving template:', this.template);
      
      // Show success message with JSON preview
      alert(`Template saved successfully!\n\nPreview of JSON data:\n${this.templateJsonString.substring(0, 150)}...`);
      
      // Set a breakpoint here for debugging
      debugger; // This will pause execution in the browser's developer tools
    } catch (error) {
      console.error('Error during image conversion:', error);
      alert('Error saving template: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
  
  // Pre-process all images to ensure they're in base64 format
  async preProcessImages(): Promise<void> {
    // Get all image elements
    const imageElements = this.canvasElements.filter(element => element.type === 'image');
    
    // Process each image element
    const conversionPromises = imageElements.map(async (element, index) => {
      if (!element.src || element.src.startsWith('data:')) {
        // Already a data URL, no need to convert
        return;
      }
      
      try {
        // Convert the image to base64
        const base64Data = await this.convertImageToBase64(element.src);
        
        // Update the element with the base64 data
        const elementIndex = this.canvasElements.findIndex(e => e.id === element.id);
        if (elementIndex !== -1) {
          this.canvasElements[elementIndex].src = base64Data;
        }
      } catch (error) {
        console.warn(`Failed to convert image ${element.id} to base64:`, error);
        // Continue with other images even if one fails
      }
    });
    
    // Wait for all conversions to complete
    await Promise.all(conversionPromises);
  }
  
  // Promise-based image to base64 conversion
  convertImageToBase64(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS if the image is from another domain
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0);
          
          // Convert to base64
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imageUrl}`));
      };
      
      // Start loading the image
      img.src = imageUrl;
    });
  }
  
  // Generate standardized template JSON
  generateTemplateJson(): any {
    // Create the template JSON structure according to the required format
    const templateJson = {
      width: this.canvasWidth,
      height: this.canvasHeight,
      elements: this.canvasElements.map((element, index) => {
        // Base element properties that all elements will have
        const jsonElement: any = {
          id: element.id || `element_${index}`,
          type: element.type === 'shape' ? 'image' : element.type, // Convert shape to image type as requested
          x: element.x || 0,
          y: element.y || 0,
          scale: 1.0,
          rotation: element.rotate || 0,
          z: index
        };
        
        // Add type-specific properties
        switch (element.type) {
          case 'text':
            // For text elements
            jsonElement.text = element.content || '';
            jsonElement.fontFamily = element.fontFamily || 'Roboto';
            jsonElement.fontSize = element.fontSize || 24;
            jsonElement.color = element.color || '#000000';
            break;
            
          case 'image':
          case 'shape': // Handle shapes as images
            // For images, use the source as URL
            if (element.src) {
              jsonElement.url = element.src;
            } else if (element.type === 'shape') {
              // If it's a shape with no src, generate an SVG representation
              jsonElement.url = this.getShapeAsBase64(element);
            } else {
              // Default placeholder for missing images
              jsonElement.url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
            }
            break;
        }
        
        return jsonElement;
      })
    };
    
    return templateJson;
  }
  
  // Helper method to convert an image URL to base64 placeholder
  // In a real application, this would actually fetch and convert the image
  getImageAsBase64Placeholder(imageUrl: string): string {
    // If it's a local asset, try to convert it
    if (imageUrl.startsWith('assets/') || imageUrl.startsWith('./assets/') || imageUrl.startsWith('/assets/')) {
      try {
        // For local assets that might be already cached in the browser
        return this.convertLocalImageToBase64(imageUrl);
      } catch (e) {
        console.warn('Could not convert local image to base64:', e);
      }
    }
    
    // Extract the filename from the URL for a more informative placeholder
    const filename = imageUrl.split('/').pop() || 'image';
    
    // For demonstration purposes, we're returning a base64 placeholder
    // with the original URL embedded in a comment
    // In a real implementation, you would use the Canvas API to load and convert the image
    
    // Create a simple colored rectangle as a placeholder
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#e0e0e0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="12" fill="#333" text-anchor="middle">${filename}</text>
        <!-- Original URL: ${imageUrl} -->
      </svg>
    `;
    
    // Convert SVG to base64
    return `data:image/svg+xml;base64,${btoa(svgContent.trim())}`;
  }
  
  // This method attempts to convert a local image to base64 synchronously
  // Note: This works for images that are already loaded/cached in the browser
  // For production use, an asynchronous approach is recommended
  convertLocalImageToBase64(imageUrl: string): string {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Create an image element
    const img = new Image();
    
    // Set a flag to track if the image is loaded
    let isLoaded = false;
    
    // Set up the onload handler that will set the flag
    img.onload = () => {
      isLoaded = true;
    };
    
    // Set the source to start loading
    img.src = imageUrl;
    
    // If the image is already cached, the onload event might have fired
    // before we had a chance to set the handler
    if (img.complete) {
      isLoaded = true;
    }
    
    // If image isn't loaded yet, we can't convert it synchronously
    if (!isLoaded) {
      throw new Error('Image not loaded');
    }
    
    // Draw the image on the canvas
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // Convert canvas to data URL
    try {
      return canvas.toDataURL('image/png');
    } catch (e) {
      // This can happen with cross-origin images
      console.error('Error converting to data URL:', e);
      throw e;
    }
  }
  
  // Helper method to convert a shape element to base64
  getShapeAsBase64(element: CanvasElement): string {
    const width = element.width || 100;
    const height = element.height || 100;
    const color = element.color || '#3498db';
    const shape = element.shape || 'rectangle';
    
    let svgContent = '';
    
    switch (shape) {
      case 'circle':
        const radius = Math.min(width, height) / 2;
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <circle cx="${width/2}" cy="${height/2}" r="${radius}" fill="${color}"/>
          </svg>
        `;
        break;
      case 'triangle':
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <polygon points="${width/2},0 ${width},${height} 0,${height}" fill="${color}"/>
          </svg>
        `;
        break;
      case 'ellipse':
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <ellipse cx="${width/2}" cy="${height/2}" rx="${width/2}" ry="${height/2}" fill="${color}"/>
          </svg>
        `;
        break;
      default: // rectangle or any other shape
        svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect width="${width}" height="${height}" fill="${color}"/>
          </svg>
        `;
    }
    
    // Convert SVG to base64
    return `data:image/svg+xml;base64,${btoa(svgContent.trim())}`;
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
  
  // Keyboard shortcuts and clipboard functionality
  copyElements(): void {
    if (this.selectedElement !== null) {
      // Copy the selected element
      this.clipboardElements = [JSON.parse(JSON.stringify(this.canvasElements[this.selectedElement]))];
    } else if (this.selectedElements.length > 0) {
      // Copy multiple selected elements
      this.clipboardElements = this.selectedElements.map(index => 
        JSON.parse(JSON.stringify(this.canvasElements[index]))
      );
    }
  }

  pasteElements(): void {
    if (this.clipboardElements.length === 0) return;
    
    // Clear current selection
    this.selectedElement = null;
    this.selectedElements = [];
    
    // Paste elements with offset
    const pastedElements: number[] = [];
    
    this.clipboardElements.forEach((element, index) => {
      const newElement = JSON.parse(JSON.stringify(element));
      newElement.id = `element_${Date.now()}_${index}`;
      newElement.x += 20; // Offset pasted elements
      newElement.y += 20;
      
      this.canvasElements.push(newElement);
      pastedElements.push(this.canvasElements.length - 1);
    });
    
    // Select the pasted elements
    if (pastedElements.length === 1) {
      this.selectedElement = pastedElements[0];
    } else {
      this.selectedElements = pastedElements;
    }
    
    this.saveToHistory();
  }

  selectAllElements(): void {
    this.selectedElements = this.canvasElements.map((_, index) => index);
    this.selectedElement = null;
  }

  exportAsPNG(): void {
    // Create a canvas to render the template
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get canvas context for export');
      return;
    }
    
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    // Fill background
    ctx.fillStyle = this.getCanvasBackgroundStyle();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw elements (simplified - in a real implementation you'd need to handle all element types)
    this.canvasElements.forEach(element => {
      ctx.save();
      ctx.translate(element.x, element.y);
      
      if (element.rotate) {
        ctx.rotate((element.rotate * Math.PI) / 180);
      }
      
      // Draw based on element type
      if (element.type === 'text') {
        ctx.fillStyle = element.color || '#000000';
        ctx.font = `${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
        ctx.textAlign = (element.textAlign as CanvasTextAlign) || 'left';
        ctx.fillText(element.content || '', 0, element.fontSize || 16);
      } else if (element.type === 'shape') {
        ctx.fillStyle = element.color || '#3498db';
        if (element.shape === 'rectangle') {
          ctx.fillRect(0, 0, element.width, element.height);
        } else if (element.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(element.width / 2, element.height / 2, Math.min(element.width, element.height) / 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else if (element.type === 'image' && element.src) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        // Note: This is a simplified implementation. In practice, you'd need to handle async image loading
        try {
          // For demo purposes, we'll skip image rendering in export
          // A real implementation would need to wait for all images to load
        } catch (e) {
          console.warn('Image export not implemented in this demo');
        }
      }
      
      ctx.restore();
    });
    
    // Download the image
    const link = document.createElement('a');
    link.download = 'template.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  zoomIn(): void {
    this.zoom(10);
  }

  zoomOut(): void {
    this.zoom(-10);
  }

  moveElement(deltaX: number, deltaY: number): void {
    if (this.selectedElement !== null) {
      this.canvasElements[this.selectedElement].x += deltaX;
      this.canvasElements[this.selectedElement].y += deltaY;
      this.updateElement();
    } else if (this.selectedElements.length > 0) {
      this.selectedElements.forEach(index => {
        this.canvasElements[index].x += deltaX;
        this.canvasElements[index].y += deltaY;
      });
      this.updateElement();
    }
  }

  groupSelectedElements(): void {
    if (this.selectedElements.length < 2) return;
    
    // Calculate group bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    this.selectedElements.forEach(index => {
      const element = this.canvasElements[index];
      minX = Math.min(minX, element.x);
      minY = Math.min(minY, element.y);
      maxX = Math.max(maxX, element.x + (element.width || 0));
      maxY = Math.max(maxY, element.y + (element.height || 0));
    });
    
    // Create group element
    const groupElement: CanvasElement = {
      id: `group_${Date.now()}`,
      type: 'group',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      children: this.selectedElements.map(index => this.canvasElements[index].id),
      locked: false,
      visible: true
    };
    
    // Remove individual elements and add group
    const elementsToRemove = [...this.selectedElements].sort((a, b) => b - a);
    elementsToRemove.forEach(index => {
      this.canvasElements.splice(index, 1);
    });
    
    this.canvasElements.push(groupElement);
    
    // Select the new group
    this.selectedElement = this.canvasElements.length - 1;
    this.selectedElements = [];
    
    this.saveToHistory();
  }

  ungroupSelectedElements(): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'group') return;
    
    const groupElement = this.canvasElements[this.selectedElement];
    const childIds = groupElement.children || [];
    
    // In a real implementation, you'd need to store the original elements
    // For now, we'll create placeholder elements based on the group position
    const childElements: CanvasElement[] = [];
    childIds.forEach((childId, index) => {
      const childElement: CanvasElement = {
        id: childId,
        type: 'shape',
        shape: 'rectangle',
        x: groupElement.x + (index * 20),
        y: groupElement.y + (index * 20),
        width: 100,
        height: 100,
        color: '#3498db',
        locked: false,
        visible: true
      };
      childElements.push(childElement);
    });
    
    // Remove group and add children
    this.canvasElements.splice(this.selectedElement, 1);
    this.canvasElements.push(...childElements);
    
    // Select the first child
    this.selectedElement = this.canvasElements.length - childElements.length;
    this.selectedElements = [];
    
    this.saveToHistory();
  }
  
  // Element styling methods
  getElementTransform(element: CanvasElement): string {
    let transform = '';
    
    if (element.rotate && element.rotate !== 0) {
      transform += `rotate(${element.rotate}deg) `;
    }
    
    if (element.x !== undefined && element.y !== undefined) {
      transform += `translate(${element.x}px, ${element.y}px)`;
    }
    
    return transform.trim();
  }
  
  getTextColor(element: CanvasElement): string {
    if (element.type !== 'text') return '#000000';
    
    if (element.textGradientType && element.textGradientType !== 'none') {
      return 'transparent';
    }
    
    return element.color || '#000000';
  }
  
  getTextGradient(element: CanvasElement): string {
    if (element.type !== 'text' || !element.textGradientType || element.textGradientType === 'none') {
      return 'none';
    }
    
    const color1 = element.textGradientColor1 || '#000000';
    const color2 = element.textGradientColor2 || '#ffffff';
    const angle = element.textGradientAngle || 0;
    
    if (element.textGradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    } else if (element.textGradientType === 'radial') {
      return `radial-gradient(circle, ${color1}, ${color2})`;
    }
    
    return 'none';
  }
  
  getTextBackgroundColor(element: CanvasElement): string {
    if (element.type !== 'text') return 'transparent';
    return element.backgroundColor || 'transparent';
  }
  
  getTextTransform(element: CanvasElement): string {
    if (element.type !== 'text') return 'none';
    
    let transform = '';
    
    if (element.textRotation) {
      transform += `rotate(${element.textRotation}deg) `;
    }
    
    if (element.textPath && element.textPath !== 'none') {
      // This would require more complex CSS for text path effects
      // For now, we'll just return the rotation
    }
    
    return transform.trim() || 'none';
  }
  
  getImageFilter(element: CanvasElement): string {
    if (element.type !== 'image' || !element.filter || element.filter === 'none') {
      return 'none';
    }
    
    let filterString = '';
    
    if (element.brightness && element.brightness !== 100) {
      filterString += `brightness(${element.brightness}%) `;
    }
    
    if (element.contrast && element.contrast !== 100) {
      filterString += `contrast(${element.contrast}%) `;
    }
    
    if (element.saturation && element.saturation !== 100) {
      filterString += `saturate(${element.saturation}%) `;
    }
    
    if (element.hueRotate && element.hueRotate !== 0) {
      filterString += `hue-rotate(${element.hueRotate}deg) `;
    }
    
    if (element.blur && element.blur > 0) {
      filterString += `blur(${element.blur}px) `;
    }
    
    if (element.sepia && element.sepia > 0) {
      filterString += `sepia(${element.sepia}%) `;
    }
    
    if (element.grayscale && element.grayscale > 0) {
      filterString += `grayscale(${element.grayscale}%) `;
    }
    
    if (element.invert && element.invert > 0) {
      filterString += `invert(${element.invert}%) `;
    }
    
    return filterString.trim() || 'none';
  }
  
  getImageMask(element: CanvasElement): string {
    if (element.type !== 'image' || !element.maskType || element.maskType === 'rectangle') {
      return 'none';
    }
    
    if (element.maskType === 'circle') {
      return `clip-path: circle(50% at center);`;
    } else if (element.maskType === 'custom') {
      // Custom mask would require more complex implementation
      return 'none';
    }
    
    return 'none';
  }
  
  getShapeBackground(element: CanvasElement): string {
    if (element.type !== 'shape') return '#3498db';
    
    if (element.gradient && element.gradient !== 'none') {
      return element.gradient;
    }
    
    return element.color || '#3498db';
  }
  
  getShapeBorderRadius(element: CanvasElement): number {
    if (element.type !== 'shape') return 0;
    
    // For special shapes, we might want different border radius
    if (element.shape === 'circle') {
      return Math.min(element.width, element.height) / 2;
    }
    
    return element.borderRadius || 0;
  }
  
  getShapeClipPath(element: CanvasElement): string {
    if (element.type !== 'shape' || !element.shape || element.shape === 'rectangle') {
      return 'none';
    }
    
    // Define clip paths for different shapes
    switch (element.shape) {
      case 'circle':
        return 'circle(50% at center)';
      case 'triangle':
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'hexagon':
        return 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)';
      case 'octagon':
        return 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
      case 'pentagon':
        return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
      case 'star':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'heart':
        return 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")';
      case 'speech-bubble':
        return 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 25% 100%, 25% 75%, 0% 75%)';
      case 'burst':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'cloud':
        return 'ellipse(60% 40% 40% 30%) ellipse(40% 50% 35% 25%) ellipse(70% 55% 30% 20%)';
      default:
        return 'none';
    }
  }
  
  getIconFilter(element: CanvasElement): string {
    if (element.type !== 'icon' || !element.filter || element.filter === 'none') {
      return 'none';
    }
    
    // Similar to image filters but for icons
    return this.getImageFilter(element);
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
  
  toggleSmartGuides(): void {
    this.showSmartGuides = !this.showSmartGuides;
  }
  
  toggleSnapToGuides(): void {
    this.snapToGuides = !this.snapToGuides;
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
  
  // Layer management methods
  hasGroupedElements(): boolean {
    return this.canvasElements.some(element => element.type === 'group');
  }
  
  trackByElementId(index: number, element: CanvasElement): string {
    return element.id;
  }
  
  selectLayer(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedElement = index;
    
    // On mobile, automatically switch to properties panel when an element is selected
    if (window.innerWidth < 768) {
      this.activeMobilePanel = 'properties';
    }
  }
  
  startLayerRename(index: number): void {
    const element = this.canvasElements[index];
    if (!element) return;
    
    // Store the current name for potential cancellation
    (element as any)['originalName'] = element.layerName || element.name;
    element.editing = true;
  }
  
  getDefaultLayerName(element: CanvasElement, index: number): string {
    if (element.layerName) return element.layerName;
    if (element.name) return element.name;
    
    // Generate default name based on type
    const typeName = element.type.charAt(0).toUpperCase() + element.type.slice(1);
    return `${typeName} ${index + 1}`;
  }
  
  finishLayerRename(index: number): void {
    const element = this.canvasElements[index];
    if (!element) return;
    
    element.editing = false;
    // Remove the temporary original name property
    delete (element as any)['originalName'];
    
    this.saveToHistory();
  }
  
  cancelLayerRename(index: number): void {
    const element = this.canvasElements[index];
    if (!element) return;
    
    // Restore original name if it was stored
    if ((element as any)['originalName'] !== undefined) {
      element.layerName = (element as any)['originalName'];
    }
    
    element.editing = false;
    delete (element as any)['originalName'];
  }
  
  toggleLayerVisibility(index: number, event: MouseEvent): void {
    event.stopPropagation();
    const element = this.canvasElements[index];
    if (!element) return;
    
    element.visible = !element.visible;
    this.updateElement();
  }
  
  toggleLayerLock(index: number, event: MouseEvent): void {
    event.stopPropagation();
    const element = this.canvasElements[index];
    if (!element) return;
    
    element.locked = !element.locked;
    this.updateElement();
  }
  
  bringToFront(): void {
    if (this.selectedElement === null || this.selectedElement >= this.canvasElements.length - 1) return;
    
    const element = this.canvasElements.splice(this.selectedElement, 1)[0];
    this.canvasElements.push(element);
    this.selectedElement = this.canvasElements.length - 1;
    this.saveToHistory();
  }
  
  sendToBack(): void {
    if (this.selectedElement === null || this.selectedElement <= 0) return;
    
    const element = this.canvasElements.splice(this.selectedElement, 1)[0];
    this.canvasElements.unshift(element);
    this.selectedElement = 0;
    this.saveToHistory();
  }
  
  resetElementTransform(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    element.x = 100;
    element.y = 100;
    element.rotate = 0;
    element.width = element.type === 'text' ? 200 : 200;
    element.height = element.type === 'text' ? 50 : 150;
    
    this.updateElement();
  }
  
  // Alignment methods
  alignElement(alignment: string): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    const canvasCenterX = this.canvasWidth / 2;
    const canvasCenterY = this.canvasHeight / 2;
    
    switch (alignment) {
      case 'left':
        element.x = 0;
        break;
      case 'center-horizontal':
        element.x = canvasCenterX - (element.width / 2);
        break;
      case 'right':
        element.x = this.canvasWidth - element.width;
        break;
      case 'top':
        element.y = 0;
        break;
      case 'center-vertical':
        element.y = canvasCenterY - (element.height / 2);
        break;
      case 'bottom':
        element.y = this.canvasHeight - element.height;
        break;
    }
    
    this.updateElement();
  }
  
  distributeElements(direction: 'horizontal' | 'vertical'): void {
    const elementsToDistribute = this.selectedElements.length > 0 ? this.selectedElements : [this.selectedElement!];
    if (elementsToDistribute.length < 3) return; // Need at least 3 elements to distribute
    
    // Sort elements by position
    const sortedElements = elementsToDistribute
      .map(index => ({ index, element: this.canvasElements[index] }))
      .sort((a, b) => {
        if (direction === 'horizontal') {
          return a.element.x - b.element.x;
        } else {
          return a.element.y - b.element.y;
        }
      });
    
    // Calculate total space and spacing
    const firstElement = sortedElements[0].element;
    const lastElement = sortedElements[sortedElements.length - 1].element;
    
    let totalSpace: number;
    let startPosition: number;
    
    if (direction === 'horizontal') {
      totalSpace = (lastElement.x + lastElement.width) - firstElement.x;
      startPosition = firstElement.x;
    } else {
      totalSpace = (lastElement.y + lastElement.height) - firstElement.y;
      startPosition = firstElement.y;
    }
    
    // Calculate spacing between elements
    const totalElementsWidth = sortedElements.reduce((sum, item) => {
      return sum + (direction === 'horizontal' ? item.element.width : item.element.height);
    }, 0);
    
    const availableSpace = totalSpace - totalElementsWidth;
    const spacing = availableSpace / (sortedElements.length - 1);
    
    // Distribute elements
    let currentPosition = startPosition;
    
    sortedElements.forEach((item, i) => {
      if (direction === 'horizontal') {
        item.element.x = currentPosition;
        currentPosition += item.element.width + spacing;
      } else {
        item.element.y = currentPosition;
        currentPosition += item.element.height + spacing;
      }
    });
    
    this.updateElement();
  }
  
  // Text effect methods
  updateCustomTextShadow(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    const shadowColor = element.customShadowColor || 'rgba(0,0,0,0.5)';
    const blur = element.customShadowBlur || 5;
    const offsetX = element.customShadowX || 0;
    const offsetY = element.customShadowY || 5;
    
    element.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`;
    this.updateElement();
  }
  
  updateTextGradient(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    // Force update of text gradient
    this.updateElement();
  }
  
  rotateText(degrees: number): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    element.textRotation = (element.textRotation || 0) + degrees;
    this.updateElement();
  }
  
  flipText(direction: 'horizontal' | 'vertical'): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    // For text flipping, we can use CSS transforms or scale
    // This is a simplified implementation
    if (direction === 'horizontal') {
      element.textTransform = element.textTransform === 'scaleX(-1)' ? 'none' : 'scaleX(-1)';
    } else {
      element.textTransform = element.textTransform === 'scaleY(-1)' ? 'none' : 'scaleY(-1)';
    }
    
    this.updateElement();
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
    
    const selectedImage = this.canvasElements[this.selectedElement];
    if (!selectedImage.src) {
      console.error('No image source found');
      return;
    }
    
    this.currentImageToCrop = { ...selectedImage };
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
    
    this.isResizing = true;
    this.resizeHandle = handle;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.elementStartX = this.cropLeft;
    this.elementStartY = this.cropTop;
    this.elementStartWidth = this.cropWidth;
    this.elementStartHeight = this.cropHeight;
    
    const cropResizeMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const dx = moveEvent.clientX - this.dragStartX;
      const dy = moveEvent.clientY - this.dragStartY;
      
      switch (handle) {
        case 'top-left':
          this.cropLeft = Math.min(this.elementStartX + dx, this.elementStartX + this.elementStartWidth - 20);
          this.cropTop = Math.min(this.elementStartY + dy, this.elementStartY + this.elementStartHeight - 20);
          this.cropWidth = Math.max(20, this.elementStartWidth - dx);
          this.cropHeight = Math.max(20, this.elementStartHeight - dy);
          break;
        case 'top-right':
          this.cropTop = Math.min(this.elementStartY + dy, this.elementStartY + this.elementStartHeight - 20);
          this.cropWidth = Math.max(20, this.elementStartWidth + dx);
          this.cropHeight = Math.max(20, this.elementStartHeight - dy);
          break;
        case 'bottom-left':
          this.cropLeft = Math.min(this.elementStartX + dx, this.elementStartX + this.elementStartWidth - 20);
          this.cropWidth = Math.max(20, this.elementStartWidth - dx);
          this.cropHeight = Math.max(20, this.elementStartHeight + dy);
          break;
        case 'bottom-right':
          this.cropWidth = Math.max(20, this.elementStartWidth + dx);
          this.cropHeight = Math.max(20, this.elementStartHeight + dy);
          break;
      }
      
      // Apply aspect ratio if needed
      if (this.cropAspectRatio && this.cropAspectRatio !== 'free') {
        const [width, height] = this.cropAspectRatio.split(':').map(Number);
        const ratio = width / height;
        
        if (handle.includes('right')) {
          this.cropHeight = this.cropWidth / ratio;
        } else {
          this.cropWidth = this.cropHeight * ratio;
        }
      }
    };
    
    const cropResizeMouseUp = () => {
      document.removeEventListener('mousemove', cropResizeMouseMove);
      document.removeEventListener('mouseup', cropResizeMouseUp);
      this.isResizing = false;
    };
    
    document.addEventListener('mousemove', cropResizeMouseMove);
    document.addEventListener('mouseup', cropResizeMouseUp);
  }
  
  startCropDrag(event: MouseEvent): void {
    // Prevent event bubbling to parent
    event.stopPropagation();
    
    // Only handle primary button (left click)
    if (event.button !== 0) return;
    
    // Ignore clicks on resize handles
    if ((event.target as HTMLElement).classList.contains('resize-handle')) return;
    
    const startX = event.clientX;
    const startY = event.clientY;
    const startCropLeft = this.cropLeft;
    const startCropTop = this.cropTop;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      // Calculate new position
      const newLeft = startCropLeft + dx;
      const newTop = startCropTop + dy;
      
      // Get image boundaries for constraint checking
      const cropImage = document.querySelector('.crop-container img') as HTMLImageElement;
      const cropContainer = document.querySelector('.crop-container') as HTMLDivElement;
      
      if (cropImage && cropContainer) {
        const imgRect = cropImage.getBoundingClientRect();
        const containerRect = cropContainer.getBoundingClientRect();
        
        // Calculate image position relative to container
        const imgOffsetLeft = imgRect.left - containerRect.left;
        const imgOffsetTop = imgRect.top - containerRect.top;
        
        // Constrain crop area to image boundaries
        this.cropLeft = Math.max(imgOffsetLeft, Math.min(imgOffsetLeft + imgRect.width - this.cropWidth, newLeft));
        this.cropTop = Math.max(imgOffsetTop, Math.min(imgOffsetTop + imgRect.height - this.cropHeight, newTop));
      } else {
        // Fallback if we can't get image boundaries
        this.cropLeft = newLeft;
        this.cropTop = newTop;
      }
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  
  applyCropAspectRatio(): void {
    if (!this.cropAspectRatio || this.cropAspectRatio === 'free') return;
    
    const [width, height] = this.cropAspectRatio.split(':').map(Number);
    const ratio = width / height;
    
    // Adjust height based on current width
    this.cropHeight = this.cropWidth / ratio;
    
    // Make sure crop area stays within image bounds
    if (this.cropTop + this.cropHeight > this.currentImageToCrop!.height) {
      this.cropHeight = this.currentImageToCrop!.height - this.cropTop;
      this.cropWidth = this.cropHeight * ratio;
    }
  }
  
  applyCrop(): void {
    if (!this.currentImageToCrop || this.selectedElement === null) {
      this.closeCropDialog();
      return;
    }
    
    if (!this.currentImageToCrop.src) {
      console.error('No image source found');
      this.closeCropDialog();
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get canvas context');
      this.closeCropDialog();
      return;
    }
    
    // Load the image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Get the scale factor (original image vs element dimensions)
      const scaleX = img.width / this.currentImageToCrop!.width;
      const scaleY = img.height / this.currentImageToCrop!.height;
      
      // Set canvas size to the crop dimensions
      canvas.width = this.cropWidth * scaleX;
      canvas.height = this.cropHeight * scaleY;
      
      // Draw the cropped portion
      ctx.drawImage(
        img,
        this.cropLeft * scaleX,   // Source X
        this.cropTop * scaleY,    // Source Y
        this.cropWidth * scaleX,  // Source Width
        this.cropHeight * scaleY, // Source Height
        0, 0,                    // Destination X, Y
        canvas.width,            // Destination Width
        canvas.height            // Destination Height
      );
      
      // Convert to data URL
      const croppedImageDataUrl = canvas.toDataURL('image/png');
      
      // Update the element with cropped image
      if (this.selectedElement !== null) {
        this.canvasElements[this.selectedElement].src = croppedImageDataUrl;
        
        // Save to history
        this.updateElement();
      }
      
      this.closeCropDialog();
    };
    
    img.onerror = () => {
      console.error('Failed to load image for cropping');
      this.closeCropDialog();
    };
    
    img.src = this.currentImageToCrop.src;
  }
  
  flipImage(direction: 'horizontal' | 'vertical'): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    if (!element.src) {
      console.error('No image source found');
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply flip transformation
      ctx.save();
      if (direction === 'horizontal') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      } else if (direction === 'vertical') {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
      }
      
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      
      // Convert to data URL and update the element
      const flippedImageDataUrl = canvas.toDataURL('image/png');
      element.src = flippedImageDataUrl;
      
      // Save to history
      this.updateElement();
    };
    
    img.onerror = () => {
      console.error('Failed to load image for flipping');
    };
    
    img.src = element.src;
  }
  
  rotateImage(degrees: number): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    if (!element.src) {
      console.error('No image source found');
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }
      
      // Calculate new canvas dimensions for the rotated image
      let newWidth, newHeight;
      
      if (degrees % 180 === 0) {
        // 180 degree rotation - same dimensions
        newWidth = img.width;
        newHeight = img.height;
      } else {
        // 90 or 270 degree rotation - swap dimensions
        newWidth = img.height;
        newHeight = img.width;
      }
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Apply rotation transformation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
      
      // Convert to data URL and update the element
      const rotatedImageDataUrl = canvas.toDataURL('image/png');
      element.src = rotatedImageDataUrl;
      
      // If the rotation is 90 or 270 degrees, swap width and height of the element
      if (degrees % 180 !== 0) {
        const tempWidth = element.width;
        element.width = element.height;
        element.height = tempWidth;
      }
      
      // Save to history
      this.updateElement();
    };
    
    img.onerror = () => {
      console.error('Failed to load image for rotation');
    };
    
    img.src = element.src;
  }
  
  // Image editing methods
  scaleImage(): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    // Reset to original aspect ratio or apply scaling
    // This is a placeholder implementation
    this.updateElement();
  }
  
  updateImageFilters(): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    // Rebuild the filter string from individual properties
    let filterString = '';
    
    if (element.brightness && element.brightness !== 100) {
      filterString += `brightness(${element.brightness}%) `;
    }
    
    if (element.contrast && element.contrast !== 100) {
      filterString += `contrast(${element.contrast}%) `;
    }
    
    if (element.saturation && element.saturation !== 100) {
      filterString += `saturate(${element.saturation}%) `;
    }
    
    if (element.hueRotate && element.hueRotate !== 0) {
      filterString += `hue-rotate(${element.hueRotate}deg) `;
    }
    
    if (element.blur && element.blur > 0) {
      filterString += `blur(${element.blur}px) `;
    }
    
    if (element.sepia && element.sepia > 0) {
      filterString += `sepia(${element.sepia}%) `;
    }
    
    if (element.grayscale && element.grayscale > 0) {
      filterString += `grayscale(${element.grayscale}%) `;
    }
    
    if (element.invert && element.invert > 0) {
      filterString += `invert(${element.invert}%) `;
    }
    
    element.filter = filterString.trim() || 'none';
    this.updateElement();
  }
  
  applyFilterPreset(preset: string): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    
    // Reset all filters first
    element.brightness = 100;
    element.contrast = 100;
    element.saturation = 100;
    element.hueRotate = 0;
    element.blur = 0;
    element.sepia = 0;
    element.grayscale = 0;
    element.invert = 0;
    
    // Apply preset
    switch (preset) {
      case 'vintage':
        element.sepia = 30;
        element.contrast = 110;
        element.brightness = 110;
        break;
      case 'blackwhite':
        element.grayscale = 100;
        element.contrast = 120;
        break;
      case 'warm':
        element.sepia = 20;
        element.saturation = 120;
        element.brightness = 105;
        break;
      case 'cool':
        element.hueRotate = 180;
        element.saturation = 90;
        element.brightness = 105;
        break;
      case 'none':
      default:
        // Already reset above
        break;
    }
    
    this.updateImageFilters();
  }
  
  applyMask(maskType: string): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    element.maskType = maskType as 'rectangle' | 'circle' | 'custom';
    this.updateElement();
  }
  
  removeMask(): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    element.maskType = undefined;
    this.updateElement();
  }
  
  preserveTransparency(): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    element.preserveTransparency = !element.preserveTransparency;
    this.updateElement();
  }
  
  // Helper method to check if background removal is active
  isBackgroundRemovalActive(): boolean {
    if (this.selectedElement === null) return false;
    if (!this.canvasElements[this.selectedElement]) return false;
    
    const element = this.canvasElements[this.selectedElement];
    if (!element.filter) return false;
    
    return element.filter.includes('remove-background');
  }
  
  toggleBackgroundRemoval(): void {
    if (this.selectedElement === null || this.canvasElements[this.selectedElement].type !== 'image') return;
    
    const element = this.canvasElements[this.selectedElement];
    if (!element.src) {
      console.error('No image source found');
      return;
    }
    
    // First check if background removal is already applied
    if (element.filter && element.filter.includes('remove-background')) {
      // Remove the background removal filter
      element.filter = element.filter.replace('remove-background', '').trim();
      if (element.filter === '') {
        element.filter = 'none';
      }
      this.updateElement();
      return;
    }
    
    // In a real implementation, this would call a background removal API service
    // For demo purposes, we'll use a canvas-based approach to apply a simple background removal effect
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simple background removal algorithm (uses corner pixel as background color)
      // This is a simplistic approach - real background removal would use more sophisticated algorithms
      const cornerPixel = {
        r: data[0],
        g: data[1],
        b: data[2]
      };
      
      const threshold = 50; // Color difference threshold
      
      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate color difference from the corner pixel
        const colorDiff = Math.sqrt(
          Math.pow(r - cornerPixel.r, 2) +
          Math.pow(g - cornerPixel.g, 2) +
          Math.pow(b - cornerPixel.b, 2)
        );
        
        // If the color is close to the background color, make it transparent
        if (colorDiff < threshold) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }
      
      // Put the processed image data back on the canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to data URL and update the element
      const processedImageDataUrl = canvas.toDataURL('image/png');
      element.src = processedImageDataUrl;
      
      // Add a class or attribute to indicate background removal is applied
      if (!element.filter || element.filter === 'none') {
        element.filter = 'remove-background';
      } else {
        element.filter += ' remove-background';
      }
      
      // Save to history
      this.updateElement();
    };
    
    img.onerror = () => {
      console.error('Failed to load image for background removal');
    };
    
    img.src = element.src;
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
    // Only open shape selector if not currently dragging
    if (!this.isDraggingElement) {
      this.showShapeSelector = !this.showShapeSelector;
    }
  }

  // Color palette methods
  selectColor(color: string): void {
    // Add to recent colors if not already there
    if (!this.recentColors.includes(color)) {
      this.recentColors.unshift(color);
      if (this.recentColors.length > 20) {
        this.recentColors = this.recentColors.slice(0, 20);
      }
    }

    // Apply color to selected element
    if (this.selectedElement !== null) {
      const element = this.canvasElements[this.selectedElement];
      if (element.type === 'text') {
        element.color = color;
      } else if (element.type === 'shape') {
        element.color = color;
      }
      this.updateElement();
    }
  }

  removeColor(color: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const index = this.savedColors.indexOf(color);
    if (index > -1) {
      this.savedColors.splice(index, 1);
    }
  }

  openColorPicker(): void {
    this.showColorPicker = true;
    this.pickerColor = '#000000';
    this.updatePickerColor();
  }

  closeColorPicker(): void {
    this.showColorPicker = false;
  }

  updatePickerColor(): void {
    this.hexColor = this.pickerColor;
    const rgb = this.hexToRgbObject(this.pickerColor);
    this.rgbColor = rgb;
  }

  updateFromHex(): void {
    this.pickerColor = this.hexColor;
    const rgb = this.hexToRgbObject(this.hexColor);
    this.rgbColor = rgb;
  }

  updateFromRGB(): void {
    const hex = this.rgbToHex(this.rgbColor.r, this.rgbColor.g, this.rgbColor.b);
    this.hexColor = hex;
    this.pickerColor = hex;
  }

  addToPalette(): void {
    const color = this.pickerColor;
    if (!this.savedColors.includes(color)) {
      this.savedColors.push(color);
    }
    this.closeColorPicker();
  }

  saveBrandPalette(): void {
    // Save current saved colors as brand colors
    this.brandColors = [...this.savedColors];
    alert('Brand palette saved!');
  }

  loadBrandPalette(): void {
    // Load brand colors into saved colors
    this.savedColors = [...this.brandColors];
    alert('Brand palette loaded!');
  }

  // Helper methods for color conversion
  private hexToRgbObject(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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
}

