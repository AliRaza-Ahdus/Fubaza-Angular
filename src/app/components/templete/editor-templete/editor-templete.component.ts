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
  wordSpacing?: number;
  
  // Advanced text effects
  shadowType?: 'none' | 'drop' | 'inner' | 'neon' | 'multiple';
  outlineWidth?: number;
  outlineColor?: string;
  curveType?: 'none' | 'arc' | 'bridge' | 'bulge' | 'wave' | 'circle';
  curveAmount?: number;
  
  // Animation properties
  animation?: string;
  animationDuration?: number;
  animationDelay?: number;
  animationLoop?: boolean;
  
  // Smart text properties
  autoFit?: boolean;
  textWrap?: boolean;
  maskEnabled?: boolean;
  
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

interface FontItem {
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
  premium: boolean;
  previewText?: string;
  weights?: number[];
  styles?: string[];
  source: 'google' | 'custom' | 'system';
}

interface TypographyCombo {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  headingText: string;
  bodyText: string;
  category: string;
}

interface FontPairing {
  id: string;
  name: string;
  primaryFont: string;
  secondaryFont: string;
  primarySample: string;
  secondarySample: string;
}

interface TextEffectPreset {
  id: string;
  name: string;
  type: 'shadow' | 'outline' | 'gradient' | 'neon' | 'glitch' | 'vintage';
  properties: any;
}

interface TextAnimation {
  type: string;
  name: string;
  icon: string;
  duration: number;
  easing?: string;
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
  @ViewChild('backgroundUpload') backgroundUploadRef!: ElementRef;

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

  // Advanced Text Properties
  fontSearchQuery: string = '';
  activeFontCategory: string = 'all';
  filteredFonts: FontItem[] = [];
  fontLibrary: FontItem[] = [];
  typographyCombos: TypographyCombo[] = [];
  filteredTypographyCombos: TypographyCombo[] = [];
  activeTypographyCategory: string = 'all';
  previewedCombo: TypographyCombo | null = null;
  fontPairingSuggestions: FontPairing[] = [];
  textEffectPresets: TextEffectPreset[] = [];
  textAnimations: TextAnimation[] = [];
  
  // Text UI State
  activeColorTab: string = 'solid';
  activeEffectTab: string = 'shadow';
  contrastRatio: number = 0;
  
  // Color presets
  colorPresets: string[] = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
    '#FF4500', '#DA70D6', '#32CD32', '#FFD700', '#40E0D0'
  ];
  
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
  isCropping: boolean = false;
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
  isMobileDevice: boolean = false;
  screenWidth: number = 0;
  screenHeight: number = 0;
  
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
  constrainToCanvas: boolean = true;
  
  // Clipboard functionality
  clipboardElements: CanvasElement[] = [];
  
  // Performance optimization properties
  private dragAnimationFrame: number | null = null;
  private dragUpdateQueue: { x: number; y: number; timestamp: number } | null = null;
  private elementTransforms: Map<number, { x: number; y: number; element: HTMLElement }> = new Map();
  private debouncedSaveTimeout: number | null = null;
  private saveDebounceMs: number = 300;
  private lastSaveTime: number = 0;

  // Momentum and easing properties for Canva-like movement
  private dragVelocity = { x: 0, y: 0 };
  private lastDragPosition = { x: 0, y: 0 };
  private lastDragTime = 0;
  private momentumAnimationFrame: number | null = null;
  private momentumDeceleration = 0.95; // How quickly momentum slows down
  private minMomentumVelocity = 0.1; // Minimum velocity before stopping
  private dragStartTime = 0;
  private easingDuration = 150; // Duration for easing in milliseconds

  // Text performance optimizations
  private textStyleCache: Map<string, any> = new Map();
  private fontLoadCache: Map<string, boolean> = new Map();
  private gradientCache: Map<string, string> = new Map();
  private shadowCache: Map<string, string> = new Map();  // Canvas background optimization
  private backgroundCache: Map<string, string> = new Map();
  
  // Media library optimization
  private imageLoadQueue: Map<string, Promise<HTMLImageElement>> = new Map();
  private imageCache: Map<string, HTMLImageElement> = new Map();
  
  // Advanced collision detection and magnetic snapping properties
  collisionDetectionEnabled: boolean = true;
  magneticSnappingEnabled: boolean = true;
  snapTolerance: number = 8;
  collisionWarningDistance: number = 15;
  
  // Element culling for performance optimization
  elementCullingEnabled: boolean = true;
  visibleElementsCache: Map<number, boolean> = new Map();
  
  // Object pooling for vectors and transforms
  vectorPool: { x: number; y: number }[] = [];
  transformPool: { x: number; y: number; element: HTMLElement }[] = [];
  
  // Advanced cursor feedback properties
  cursorVelocityThreshold: number = 0.5;
  cursorDistanceThreshold: number = 20;
  cursorTimeThreshold: number = 150;
  
  // Text effects
  activeTextEffectTab: 'stroke' | 'shadow' | 'gradient' | 'highlight' = 'stroke';
  
  // Image filters
  activeImageFilterTab: 'basic' | 'advanced' | 'blend' = 'basic';
  
  // Resize size indicators
  showResizeIndicators: boolean = true;
  currentResizeWidth: number = 0;
  currentResizeHeight: number = 0;
  resizeIndicatorPosition: { x: number; y: number } = { x: 0, y: 0 };
  
  // Drag state tracking
  isDraggingElement: boolean = false;

  // Professional canvas drag state
  isDragOverCanvas: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize responsive detection
    this.initializeResponsiveDetection();
    
    // Initialize with empty canvas
    this.resetCanvas();
    
    // Set default panel for mobile
    this.activeMobilePanel = 'canvas';
    
    // Initialize pages
    this.pages[0] = this.canvasElements;
    
    // Initialize filtered shapes
    this.filteredShapes = [...this.allShapes];
    
    // Initialize filtered canvas elements
    this.filteredCanvasElements = [...this.canvasElements];
    
    // Initialize text features
    this.initializeFontLibrary();
    this.initializeTypographyCombos();
    this.initializeTextEffectPresets();
    this.initializeTextAnimations();
    
    // Load Google Fonts
    this.loadGoogleFonts();
    
    // Initialize performance optimizations
    this.initializePerformanceOptimizations();
    
    // Initialize element culling
    this.updateVisibleElements();
    
    // Add window resize listener
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  private initializePerformanceOptimizations(): void {
    // Enable hardware acceleration for smooth scrolling
    if (typeof window !== 'undefined') {
      // Optimize passive event listeners for better scroll performance
      const options = { passive: true };
      
      // Add optimized touch handlers for mobile
      document.addEventListener('touchstart', (e) => {
        // Prevent iOS safari bounce
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, options);
      
      // Optimize paint operations
      const style = document.createElement('style');
      style.textContent = `
        .canvas-workspace * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `;
      document.head.appendChild(style);
    }
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

  // Mobile panel management - removed duplicate, using enhanced version below

  // Text element addition - use the comprehensive method below

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

  // Professional canvas drag handlers
  onCanvasDragEnter(event: DragEvent): void {
    event.preventDefault();
    // Only show drop overlay when dragging external elements (from sidebar), not when moving existing elements
    if (this.isDraggingElement) {
      this.isDragOverCanvas = true;
    }
  }

  onCanvasDragLeave(event: DragEvent): void {
    event.preventDefault();
    // Only hide drop overlay when dragging external elements
    if (this.isDraggingElement) {
      // Only set to false if we're actually leaving the canvas area
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX;
      const y = event.clientY;

      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        this.isDragOverCanvas = false;
      }
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
    // Only process drops when dragging external elements
    if (!this.isDraggingElement || !event.dataTransfer) return;

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

    // Reset the dragging state after successful drop
    this.isDraggingElement = false;
    this.isDragOverCanvas = false;
  }

  // Add element to canvas - core functionality
  addElementToCanvas(elementType: 'text' | 'image' | 'shape' | 'line' | 'icon', data?: any, x: number = 100, y: number = 100): void {
    console.log('addElementToCanvas called with type:', elementType, 'data:', data);
    
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

    // Set default layer name based on element type
    if (!newElement.layerName) {
      const elementCount = this.canvasElements.filter(el => el.type === elementType).length + 1;
      newElement.layerName = this.getDefaultLayerName(newElement, elementCount - 1);
    }

    this.canvasElements.push(newElement);
    this.selectedElement = this.canvasElements.length - 1;
    this.saveToHistory();
    this.filterLayers();
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

    // Set default layer name for shape
    const shapeCount = this.canvasElements.filter(el => el.type === 'shape' && el.shape === shapeType).length + 1;
    newElement.layerName = `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} ${shapeCount}`;

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

  getShapeEmoji(shapeType: string): string {
    const emojiMap: { [key: string]: string } = {
      'rectangle': '🔲',
      'square': '⬜',
      'circle': '⭕',
      'ellipse': '🔵',
      'triangle': '🔺',
      'star': '⭐',
      'heart': '❤️',
      'diamond': '💎',
      'hexagon': '⬢',
      'pentagon': '🛡️',
      'octagon': '🛑',
      'arrow': '➡️',
      'line': '📏',
      'curved-line': '〰️',
      'dashed-line': '- - -',
      'bracket': '【】',
      'parenthesis': '（）',
      'cloud': '☁️',
      'burst': '💥',
      'spiral': '🌀',
      'cross': '✚',
      'plus': '➕',
      'minus': '➖',
      'checkmark': '✅',
      'x-mark': '❌'
    };
    return emojiMap[shapeType] || '🔷';
  }

  getPopularityStars(shapeType: string): number[] {
    const popularityMap: { [key: string]: number } = {
      'rectangle': 5,
      'circle': 5,
      'triangle': 4,
      'star': 5,
      'heart': 4,
      'diamond': 3,
      'hexagon': 3,
      'arrow': 4,
      'line': 5,
      'square': 4,
      'ellipse': 3,
      'pentagon': 2,
      'octagon': 2,
      'curved-line': 3,
      'dashed-line': 3,
      'cross': 3,
      'plus': 4,
      'checkmark': 4,
      'cloud': 3,
      'burst': 2,
      'spiral': 2
    };
    const starCount = popularityMap[shapeType] || 3;
    return Array(starCount).fill(0).map((_, i) => i);
  }

  trackByShape(index: number, shape: any): string {
    return shape.type;
  }

  // Line Element Creation Methods
  addLineElement(): void {
    this.addElementToCanvas('line');
  }

  // Icon Element Creation Methods  
  addIconElement(): void {
    this.addElementToCanvas('icon');
  }

  // Mobile Panel Management
  setMobilePanel(panel: 'sidebar' | 'canvas' | 'properties'): void {
    this.activeMobilePanel = panel;
    
    // If switching to properties but no element is selected, switch to canvas instead
    if (panel === 'properties' && this.selectedElement === null) {
      this.activeMobilePanel = 'canvas';
    }
  }

  // Shape Selector Toggle
  toggleShapeSelector(): void {
    this.showShapeSelector = !this.showShapeSelector;
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
    console.log('🔴🔴🔴 RESIZE HANDLE CLICKED! 🔴🔴🔴');
    console.log('🔴 Element index:', index);
    console.log('🔴 Handle type:', handle);
    console.log('🔴 Mouse event:', event);
    console.log('🔴 Element data:', this.canvasElements[index]);
    event.stopPropagation();
    event.preventDefault();
    this.isResizing = true;
    this.resizeHandle = handle;
    this.selectedElement = index;
    
    // Get the canvas workspace element to calculate proper coordinates
    const canvasWorkspace = document.querySelector('.canvas-workspace') as HTMLElement;
    if (!canvasWorkspace) {
      console.error('Canvas workspace not found!');
      return;
    }
    
    const workspaceRect = canvasWorkspace.getBoundingClientRect();
    
    // Convert screen coordinates to canvas workspace coordinates and store as canvas coordinates
    const scale = this.zoomLevel / 100;
    this.dragStartX = (event.clientX - workspaceRect.left) / scale - (this.panX / scale);
    this.dragStartY = (event.clientY - workspaceRect.top) / scale - (this.panY / scale);
    
    this.elementStartX = this.canvasElements[index].x;
    this.elementStartY = this.canvasElements[index].y;
    this.elementStartWidth = this.canvasElements[index].width;
    this.elementStartHeight = this.canvasElements[index].height;
    console.log('Resize started with handle:', handle, 'Element dimensions:', this.elementStartWidth, 'x', this.elementStartHeight);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    // Handle panning
    if (this.isPanning) {
      this.panX = event.clientX - this.panStartX;
      this.panY = event.clientY - this.panStartY;
      // Update visible elements during pan
      this.updateVisibleElements();
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
      // Queue the latest mouse position for optimized updates
      const canvasWorkspace = document.querySelector('.canvas-workspace') as HTMLElement;
      if (!canvasWorkspace) return;
      
      const workspaceRect = canvasWorkspace.getBoundingClientRect();
      const mouseX = event.clientX - workspaceRect.left;
      const mouseY = event.clientY - workspaceRect.top;
      
      // Store the latest drag update
      this.dragUpdateQueue = {
        x: mouseX,
        y: mouseY,
        timestamp: performance.now()
      };

      // Cancel any pending animation frame to avoid stacking
      if (this.dragAnimationFrame) {
        cancelAnimationFrame(this.dragAnimationFrame);
      }

      // Use requestAnimationFrame for smooth, optimized drag updates
      this.dragAnimationFrame = requestAnimationFrame(() => {
        this.performOptimizedDragUpdate();
      });
    } else if (this.isResizing && this.selectedElement !== null) {
      console.log('Resizing element:', this.selectedElement, 'with handle:', this.resizeHandle);
      console.log('Mouse position:', event.clientX, event.clientY);
      // Get the canvas workspace element to calculate proper coordinates
      const canvasWorkspace = document.querySelector('.canvas-workspace') as HTMLElement;
      if (!canvasWorkspace) {
        console.error('Canvas workspace not found!');
        return;
      }
      console.log('Canvas workspace found, calculating coordinates...');

      const workspaceRect = canvasWorkspace.getBoundingClientRect();
      console.log('Workspace rect:', workspaceRect);

      // Convert screen coordinates to canvas workspace coordinates
      const mouseX = event.clientX - workspaceRect.left;
      const mouseY = event.clientY - workspaceRect.top;
      console.log('Mouse relative to workspace:', mouseX, mouseY);

      // Account for zoom and pan transforms
      const scale = this.zoomLevel / 100;
      const canvasX = (mouseX / scale) - (this.panX / scale);
      const canvasY = (mouseY / scale) - (this.panY / scale);
      console.log('Canvas coordinates (scaled):', canvasX, canvasY);

      // Calculate the delta from the initial resize position
      const dx = canvasX - this.dragStartX;
      const dy = canvasY - this.dragStartY;
      console.log('Delta from start:', dx, dy);

      const element = this.canvasElements[this.selectedElement];
      console.log('Element before:', element.width, element.height);

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

      // Update resize indicators
      this.updateResizeIndicators(element);

      // Update cursor based on resize handle
      this.updateResizeCursor();
      console.log('Element after resize:', element.width, element.height, 'Position:', element.x, element.y);
    }
  }

  // Separate drag update method for better performance
  private performOptimizedDragUpdate(): void {
    if (!this.dragUpdateQueue) return;
    
    const { x: mouseX, y: mouseY, timestamp } = this.dragUpdateQueue;
    this.dragUpdateQueue = null; // Clear the queue
    
    // Calculate velocity for momentum
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastDragTime;
    
    if (deltaTime > 0) {
      this.dragVelocity.x = (mouseX - this.lastDragPosition.x) / deltaTime;
      this.dragVelocity.y = (mouseY - this.lastDragPosition.y) / deltaTime;
      
      // Update last position and time
      this.lastDragPosition = { x: mouseX, y: mouseY };
      this.lastDragTime = currentTime;
    }
    
    // Get cached workspace rect to avoid repeated calculations
    const canvasWorkspace = document.querySelector('.canvas-workspace') as HTMLElement;
    if (!canvasWorkspace) return;

    // Use cached rect for better performance
    const workspaceRect = canvasWorkspace.getBoundingClientRect();

    // Account for zoom and pan transforms with higher precision
    const scale = this.zoomLevel / 100;
    const canvasX = (mouseX / scale) - (this.panX / scale);
    const canvasY = (mouseY / scale) - (this.panY / scale);

    // Calculate delta with sub-pixel precision
    const dx = canvasX - ((this.dragStartX - workspaceRect.left) / scale - (this.panX / scale));
    const dy = canvasY - ((this.dragStartY - workspaceRect.top) / scale - (this.panY / scale));

    // Calculate new position
    let newX = this.elementStartX + dx;
    let newY = this.elementStartY + dy;

    // Apply constraints with minimal calculations
    if (this.snapToGrid) {
      newX = Math.round(newX / this.gridSize) * this.gridSize;
      newY = Math.round(newY / this.gridSize) * this.gridSize;
    }

    // Apply canvas constraints if enabled
    if (this.constrainToCanvas) {
      // For single element drag
      if (this.selectedElement !== null) {
        const element = this.canvasElements[this.selectedElement];
        const elementWidth = element.width || 0;
        const elementHeight = element.height || 0;
        
        newX = Math.max(0, Math.min(newX, this.canvasWidth - elementWidth));
        newY = Math.max(0, Math.min(newY, this.canvasHeight - elementHeight));
      }
      // For multi-selection drag, use the bounds of all selected elements
      else if (this.selectedElements.length > 0) {
        // Calculate the bounding box of all selected elements
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        this.selectedElements.forEach(index => {
          const element = this.canvasElements[index];
          minX = Math.min(minX, element.x);
          minY = Math.min(minY, element.y);
          maxX = Math.max(maxX, element.x + (element.width || 0));
          maxY = Math.max(maxY, element.y + (element.height || 0));
        });
        
        const selectionWidth = maxX - minX;
        const selectionHeight = maxY - minY;
        
        // Constrain the entire selection
        newX = Math.max(0, Math.min(newX, this.canvasWidth - selectionWidth));
        newY = Math.max(0, Math.min(newY, this.canvasHeight - selectionHeight));
      }
    }

    // Check for collisions and get warnings
    let collisionWarnings: string[] = [];
    if (this.selectedElement !== null) {
      const collisionResult = this.checkElementCollisions(this.selectedElement, newX, newY);
      collisionWarnings = collisionResult.warnings;
    }

    // Use transform-based movement for better performance during drag
    if (this.selectedElements.length > 1) {
      this.updateMultipleElementsWithTransforms(newX, newY);
    } else if (this.selectedElement !== null) {
      this.updateSingleElementWithTransform(this.selectedElement, newX, newY);
    }

    // Update cursor with enhanced feedback including collision warnings
    this.updateAdvancedCursorFeedback(mouseX, mouseY, collisionWarnings);
  }

  private updateSingleElementWithTransform(elementIndex: number, newX: number, newY: number): void {
    const elementDiv = document.querySelector(`[data-element-index="${elementIndex}"]`) as HTMLElement;
    if (!elementDiv) return;

    const element = this.canvasElements[elementIndex];

    // For image elements, use direct position updates instead of transforms
    // to avoid rendering conflicts that can cause screen freezing
    if (element.type === 'image') {
      elementDiv.style.left = `${newX}px`;
      elementDiv.style.top = `${newY}px`;
      elementDiv.style.transform = ''; // Ensure no transform is applied
    } else {
      // For other elements, use transform-based movement for better performance
      if (!this.elementTransforms.has(elementIndex)) {
        this.elementTransforms.set(elementIndex, {
          x: this.canvasElements[elementIndex].x,
          y: this.canvasElements[elementIndex].y,
          element: elementDiv
        });
      }

      const cached = this.elementTransforms.get(elementIndex)!;
      const translateX = newX - cached.x;
      const translateY = newY - cached.y;

      // Use transform for smooth movement (GPU accelerated)
      elementDiv.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }

    elementDiv.classList.add('dragging');

    // Update the data model without triggering change detection
    this.canvasElements[elementIndex].x = newX;
    this.canvasElements[elementIndex].y = newY;
  }

  private updateMultipleElementsWithTransforms(newX: number, newY: number): void {
    this.selectedElements.forEach(index => {
      const element = this.canvasElements[index];
      const elementDiv = document.querySelector(`[data-element-index="${index}"]`) as HTMLElement;
      if (!elementDiv) return;

      // Calculate relative position for multi-selection
      const originalDx = element.x - this.elementStartX;
      const originalDy = element.y - this.elementStartY;
      const finalX = newX + originalDx;
      const finalY = newY + originalDy;

      // Handle image elements differently
      if (element.type === 'image') {
        elementDiv.style.left = `${finalX}px`;
        elementDiv.style.top = `${finalY}px`;
        elementDiv.style.transform = ''; // Ensure no transform is applied
      } else {
        // Cache and apply transform for other elements
        if (!this.elementTransforms.has(index)) {
          this.elementTransforms.set(index, {
            x: element.x,
            y: element.y,
            element: elementDiv
          });
        }

        const cached = this.elementTransforms.get(index)!;
        const translateX = finalX - cached.x;
        const translateY = finalY - cached.y;

        elementDiv.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }

      elementDiv.classList.add('dragging');

      // Update data model
      element.x = finalX;
      element.y = finalY;
    });
  }

  private cleanupTransforms(): void {
    // Apply final positions and clean up transforms
    this.elementTransforms.forEach((cached, index) => {
      const element = this.canvasElements[index];

      // For image elements, position is already updated directly, just remove dragging class
      if (element.type === 'image') {
        cached.element.classList.remove('dragging');
        cached.element.classList.remove('momentum-animating');
        cached.element.classList.remove('momentum-complete');
      } else {
        // For other elements, reset transform and apply final position
        cached.element.style.transform = '';
        cached.element.classList.remove('dragging');
        cached.element.classList.remove('momentum-animating');
        cached.element.classList.remove('momentum-complete');
      }

      // Return transform object to pool
      this.returnTransformToPool(cached);
    });
    this.elementTransforms.clear();
    document.body.style.cursor = '';
    document.body.classList.remove('cursor-grabbing-enhanced', 'cursor-collision-warning');

    // Update visible elements after drag operation
    this.updateVisibleElements();
  }

  // Check if current velocity is significant enough for momentum
  private hasSignificantMomentum(): boolean {
    const speed = Math.sqrt(this.dragVelocity.x * this.dragVelocity.x + this.dragVelocity.y * this.dragVelocity.y);
    return speed > this.minMomentumVelocity;
  }

  // Start momentum animation for Canva-like smooth movement
  private startMomentumAnimation(): void {
    if (this.momentumAnimationFrame) {
      cancelAnimationFrame(this.momentumAnimationFrame);
    }

    const animate = () => {
      // Apply deceleration to velocity
      this.dragVelocity.x *= this.momentumDeceleration;
      this.dragVelocity.y *= this.momentumDeceleration;

      // Check if velocity is still significant
      const speed = Math.sqrt(this.dragVelocity.x * this.dragVelocity.x + this.dragVelocity.y * this.dragVelocity.y);
      if (speed < this.minMomentumVelocity) {
        // Stop animation and save
        this.momentumAnimationFrame = null;

        // Add momentum completion animation class
        if (this.selectedElements.length > 1) {
          this.selectedElements.forEach(index => {
            const elementDiv = document.querySelector(`[data-element-index="${index}"]`) as HTMLElement;
            if (elementDiv) {
              elementDiv.classList.add('momentum-complete');
              setTimeout(() => elementDiv.classList.remove('momentum-complete'), 300);
            }
          });
        } else if (this.selectedElement !== null) {
          const elementDiv = document.querySelector(`[data-element-index="${this.selectedElement}"]`) as HTMLElement;
          if (elementDiv) {
            elementDiv.classList.add('momentum-complete');
            setTimeout(() => elementDiv.classList.remove('momentum-complete'), 300);
          }
        }

        this.debouncedSave();
        return;
      }

      // Apply momentum to element positions
      if (this.selectedElements.length > 1) {
        this.applyMomentumToMultipleElements();
      } else if (this.selectedElement !== null) {
        this.applyMomentumToSingleElement();
      }

      // Continue animation
      this.momentumAnimationFrame = requestAnimationFrame(animate);
    };

    // Start the animation
    this.momentumAnimationFrame = requestAnimationFrame(animate);
  }

  // Apply momentum to a single element
  private applyMomentumToSingleElement(): void {
    if (this.selectedElement === null) return;

    const element = this.canvasElements[this.selectedElement];
    const elementDiv = document.querySelector(`[data-element-index="${this.selectedElement}"]`) as HTMLElement;
    
    if (!elementDiv) return;

    // Calculate new position based on momentum
    let newX = element.x + this.dragVelocity.x;
    let newY = element.y + this.dragVelocity.y;

    // Apply constraints
    if (this.constrainToCanvas) {
      newX = Math.max(0, Math.min(newX, this.canvasWidth - (element.width || 0)));
      newY = Math.max(0, Math.min(newY, this.canvasHeight - (element.height || 0)));
    }

    if (this.snapToGrid) {
      newX = Math.round(newX / this.gridSize) * this.gridSize;
      newY = Math.round(newY / this.gridSize) * this.gridSize;
    }

    // Update element position
    element.x = newX;
    element.y = newY;
    elementDiv.style.left = `${newX}px`;
    elementDiv.style.top = `${newY}px`;
  }

  // Apply momentum to multiple elements
  private applyMomentumToMultipleElements(): void {
    this.selectedElements.forEach(index => {
      const element = this.canvasElements[index];
      const elementDiv = document.querySelector(`[data-element-index="${index}"]`) as HTMLElement;
      
      if (!elementDiv) return;

      // Calculate new position based on momentum
      let newX = element.x + this.dragVelocity.x;
      let newY = element.y + this.dragVelocity.y;

      // Apply constraints
      if (this.constrainToCanvas) {
        newX = Math.max(0, Math.min(newX, this.canvasWidth - (element.width || 0)));
        newY = Math.max(0, Math.min(newY, this.canvasHeight - (element.height || 0)));
      }

      if (this.snapToGrid) {
        newX = Math.round(newX / this.gridSize) * this.gridSize;
        newY = Math.round(newY / this.gridSize) * this.gridSize;
      }

      // Update element position
      element.x = newX;
      element.y = newY;
      elementDiv.style.left = `${newX}px`;
      elementDiv.style.top = `${newY}px`;
    });
  }

  // Easing function for smooth acceleration/deceleration
  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  // Enhanced cursor management for better visual feedback
  private updateDragCursor(mouseX: number, mouseY: number): void {
    if (!this.isDragging) return;

    // Calculate distance from drag start for dynamic cursor feedback
    const distance = Math.sqrt(
      Math.pow(mouseX - this.dragStartX, 2) +
      Math.pow(mouseY - this.dragStartY, 2)
    );

    // Calculate drag speed for enhanced feedback
    const currentTime = performance.now();
    const dragDuration = currentTime - this.dragStartTime;
    const speed = distance / Math.max(dragDuration, 1); // pixels per ms

    // Change cursor based on drag distance, time, and speed
    if (distance > 20 || dragDuration > 150) {
      // Enhanced grabbing cursor for active dragging
      document.body.style.cursor = 'grabbing';
      document.body.classList.add('cursor-grabbing-enhanced');
    } else if (distance > 5) {
      // Standard grabbing for initial movement
      document.body.style.cursor = 'grabbing';
      document.body.classList.remove('cursor-grabbing-enhanced');
    } else {
      // Grab cursor for hover state
      document.body.style.cursor = 'grab';
      document.body.classList.remove('cursor-grabbing-enhanced');
    }
  }

  // Advanced collision detection methods
  private checkElementCollisions(draggedElementIndex: number, newX: number, newY: number): { hasCollision: boolean; warnings: string[] } {
    if (!this.collisionDetectionEnabled) {
      return { hasCollision: false, warnings: [] };
    }

    const draggedElement = this.canvasElements[draggedElementIndex];
    const warnings: string[] = [];
    let hasCollision = false;

    // Check collision with other elements
    this.canvasElements.forEach((element, index) => {
      if (index === draggedElementIndex) return; // Skip self

      const distance = this.getElementDistance(
        { x: newX, y: newY, width: draggedElement.width || 0, height: draggedElement.height || 0 },
        { x: element.x, y: element.y, width: element.width || 0, height: element.height || 0 }
      );

      if (distance <= this.collisionWarningDistance) {
        hasCollision = true;
        warnings.push(`Close to ${element.layerName || `Element ${index + 1}`}`);
      }
    });

    return { hasCollision, warnings };
  }

  private getElementDistance(rect1: { x: number; y: number; width: number; height: number },
                           rect2: { x: number; y: number; width: number; height: number }): number {
    const center1 = {
      x: rect1.x + rect1.width / 2,
      y: rect1.y + rect1.height / 2
    };

    const center2 = {
      x: rect2.x + rect2.width / 2,
      y: rect2.y + rect2.height / 2
    };

    return Math.sqrt(
      Math.pow(center2.x - center1.x, 2) +
      Math.pow(center2.y - center1.y, 2)
    );
  }

  private applyMagneticSnapping(draggedElementIndex: number, newX: number, newY: number): { x: number; y: number } {
    if (!this.magneticSnappingEnabled) {
      return { x: newX, y: newY };
    }

    const draggedElement = this.canvasElements[draggedElementIndex];
    let snappedX = newX;
    let snappedY = newY;

    // Check snapping to other elements
    this.canvasElements.forEach((element, index) => {
      if (index === draggedElementIndex) return;

      // Horizontal snapping (left/right edges and centers)
      const draggedCenterX = newX + (draggedElement.width || 0) / 2;
      const elementCenterX = element.x + (element.width || 0) / 2;

      if (Math.abs(newX - element.x) <= this.snapTolerance) {
        snappedX = element.x;
      } else if (Math.abs(newX + (draggedElement.width || 0) - element.x) <= this.snapTolerance) {
        snappedX = element.x - (draggedElement.width || 0);
      } else if (Math.abs(draggedCenterX - elementCenterX) <= this.snapTolerance) {
        snappedX = elementCenterX - (draggedElement.width || 0) / 2;
      }

      // Vertical snapping (top/bottom edges and centers)
      const draggedCenterY = newY + (draggedElement.height || 0) / 2;
      const elementCenterY = element.y + (element.height || 0) / 2;

      if (Math.abs(newY - element.y) <= this.snapTolerance) {
        snappedY = element.y;
      } else if (Math.abs(newY + (draggedElement.height || 0) - element.y) <= this.snapTolerance) {
        snappedY = element.y - (draggedElement.height || 0);
      } else if (Math.abs(draggedCenterY - elementCenterY) <= this.snapTolerance) {
        snappedY = elementCenterY - (draggedElement.height || 0) / 2;
      }
    });

    // Canvas edge snapping
    if (Math.abs(newX) <= this.snapTolerance) {
      snappedX = 0;
    } else if (Math.abs(newX + (draggedElement.width || 0) - this.canvasWidth) <= this.snapTolerance) {
      snappedX = this.canvasWidth - (draggedElement.width || 0);
    }

    if (Math.abs(newY) <= this.snapTolerance) {
      snappedY = 0;
    } else if (Math.abs(newY + (draggedElement.height || 0) - this.canvasHeight) <= this.snapTolerance) {
      snappedY = this.canvasHeight - (draggedElement.height || 0);
    }

    return { x: snappedX, y: snappedY };
  }

  // Object pooling methods for performance optimization
  private getVectorFromPool(x: number = 0, y: number = 0): { x: number; y: number } {
    if (this.vectorPool.length > 0) {
      const vector = this.vectorPool.pop()!;
      vector.x = x;
      vector.y = y;
      return vector;
    }
    return { x, y };
  }

  private returnVectorToPool(vector: { x: number; y: number }): void {
    if (this.vectorPool.length < 50) { // Limit pool size
      this.vectorPool.push(vector);
    }
  }

  private getTransformFromPool(x: number = 0, y: number = 0, element: HTMLElement): { x: number; y: number; element: HTMLElement } {
    if (this.transformPool.length > 0) {
      const transform = this.transformPool.pop()!;
      transform.x = x;
      transform.y = y;
      transform.element = element;
      return transform;
    }
    return { x, y, element };
  }

  private returnTransformToPool(transform: { x: number; y: number; element: HTMLElement }): void {
    if (this.transformPool.length < 20) { // Limit pool size
      this.transformPool.push(transform);
    }
  }

  // Element culling for performance optimization
  private updateVisibleElements(): void {
    if (!this.elementCullingEnabled) return;

    const viewportRect = {
      left: -this.panX,
      top: -this.panY,
      right: -this.panX + (window.innerWidth / (this.zoomLevel / 100)),
      bottom: -this.panY + (window.innerHeight / (this.zoomLevel / 100))
    };

    this.canvasElements.forEach((element, index) => {
      const elementRect = {
        left: element.x,
        top: element.y,
        right: element.x + (element.width || 0),
        bottom: element.y + (element.height || 0)
      };

      const isVisible = !(
        elementRect.right < viewportRect.left ||
        elementRect.left > viewportRect.right ||
        elementRect.bottom < viewportRect.top ||
        elementRect.top > viewportRect.bottom
      );

      // Don't hide elements that are currently being dragged
      const isBeingDragged = this.isDragging && (
        (this.selectedElement === index) ||
        (this.selectedElements.includes(index))
      );

      this.visibleElementsCache.set(index, isVisible);

      // Update element visibility in DOM
      const elementDiv = document.querySelector(`[data-element-index="${index}"]`) as HTMLElement;
      if (elementDiv) {
        elementDiv.style.display = (isVisible || isBeingDragged) ? 'block' : 'none';
      }
    });
  }

  // Enhanced cursor feedback based on velocity and collision warnings
  private updateAdvancedCursorFeedback(mouseX: number, mouseY: number, collisionWarnings: string[]): void {
    if (!this.isDragging) return;

    const currentTime = performance.now();
    const dragDuration = currentTime - this.dragStartTime;
    const distance = Math.sqrt(
      Math.pow(mouseX - this.dragStartX, 2) +
      Math.pow(mouseY - this.dragStartY, 2)
    );

    const speed = distance / Math.max(dragDuration, 1);

    // Enhanced cursor feedback based on velocity and collision state
    if (collisionWarnings.length > 0) {
      document.body.style.cursor = 'not-allowed';
      document.body.classList.add('cursor-collision-warning');
    } else if (speed > this.cursorVelocityThreshold || distance > this.cursorDistanceThreshold || dragDuration > this.cursorTimeThreshold) {
      document.body.style.cursor = 'grabbing';
      document.body.classList.add('cursor-grabbing-enhanced');
      document.body.classList.remove('cursor-collision-warning');
    } else {
      document.body.style.cursor = 'grab';
      document.body.classList.remove('cursor-grabbing-enhanced', 'cursor-collision-warning');
    }
  }

  private debouncedSave(): void {
    // Clear any existing timeout
    if (this.debouncedSaveTimeout) {
      clearTimeout(this.debouncedSaveTimeout);
    }
    
    // Set a new timeout for saving
    this.debouncedSaveTimeout = setTimeout(() => {
      const currentTime = performance.now();
      if (currentTime - this.lastSaveTime >= this.saveDebounceMs) {
        this.saveToHistory();
        this.lastSaveTime = currentTime;
      }
      this.debouncedSaveTimeout = null;
    }, this.saveDebounceMs);
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

  // Update resize indicators during resize operations
  private updateResizeIndicators(element: CanvasElement): void {
    if (!this.showResizeIndicators || !this.isResizing) return;

    this.currentResizeWidth = Math.round(element.width);
    this.currentResizeHeight = Math.round(element.height);

    // Position the indicator near the element being resized
    this.resizeIndicatorPosition = {
      x: element.x + element.width / 2,
      y: element.y - 30 // Position above the element
    };
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
      // Clean up any transform-based movements
      this.cleanupTransforms();
      
      // Start momentum animation if dragging ended with sufficient velocity
      if (this.isDragging && this.hasSignificantMomentum()) {
        this.startMomentumAnimation();
      } else {
        // Use debounced save for better performance
        this.debouncedSave();
      }
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
      this.filterLayers();
    }
  }
  
  // Select an element on the canvas
  selectElement(index: number, event: MouseEvent): void {
    console.log('🟢🟢🟢 ELEMENT SELECTED! 🟢🟢🟢');
    console.log('🟢 Element index:', index);
    console.log('🟢 Element data:', this.canvasElements[index]);
    console.log('🟢 Current selectedElement:', this.selectedElement);
    console.log('🟢 Current selectedElements:', this.selectedElements);
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
    console.log('Selection updated - selectedElement:', this.selectedElement, 'selectedElements:', this.selectedElements);
    
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
    
    // Initialize momentum tracking
    this.dragVelocity = { x: 0, y: 0 };
    this.lastDragPosition = { x: event.clientX, y: event.clientY };
    this.lastDragTime = performance.now();
    this.dragStartTime = performance.now();
    
    // Cancel any existing momentum animation
    if (this.momentumAnimationFrame) {
      cancelAnimationFrame(this.momentumAnimationFrame);
      this.momentumAnimationFrame = null;
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
      this.filterLayers();
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
    // Update visible elements after zoom change
    this.updateVisibleElements();
  }

  // Enhanced zoom and view controls
  setZoom(level: number): void {
    this.zoomLevel = Math.max(10, Math.min(500, level));
    // Update visible elements after zoom change
    this.updateVisibleElements();
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
    // Update visible elements after centering
    this.updateVisibleElements();
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
    // Create cache key from background properties
    const cacheKey = `${this.canvasBackground.type}-${this.canvasBackground.color}-${this.canvasBackground.gradientType}-${this.canvasBackground.gradientAngle}-${this.canvasBackground.gradientColor1}-${this.canvasBackground.gradientColor2}-${this.canvasBackground.imageUrl}-${this.canvasBackground.overlayColor}-${this.canvasBackground.overlayOpacity}`;
    
    // Check cache first
    if (this.backgroundCache.has(cacheKey)) {
      return this.backgroundCache.get(cacheKey)!;
    }

    let style: string;
    switch (this.canvasBackground.type) {
      case 'color':
        style = this.canvasBackground.color || '#ffffff';
        break;
        
      case 'gradient':
        if (this.canvasBackground.gradientType === 'linear') {
          style = `linear-gradient(${this.canvasBackground.gradientAngle || 45}deg, ${this.canvasBackground.gradientColor1 || '#ffffff'}, ${this.canvasBackground.gradientColor2 || '#000000'})`;
        } else {
          style = `radial-gradient(circle, ${this.canvasBackground.gradientColor1 || '#ffffff'}, ${this.canvasBackground.gradientColor2 || '#000000'})`;
        }
        break;
        
      case 'image':
        if (this.canvasBackground.imageUrl) {
          style = `url('${this.canvasBackground.imageUrl}') center/cover no-repeat`;
          if (this.canvasBackground.overlayColor && this.canvasBackground.overlayOpacity) {
            const overlay = `linear-gradient(rgba(${this.hexToRgb(this.canvasBackground.overlayColor)}, ${this.canvasBackground.overlayOpacity}), rgba(${this.hexToRgb(this.canvasBackground.overlayColor)}, ${this.canvasBackground.overlayOpacity}))`;
            style = `${overlay}, ${style}`;
          }
        } else {
          style = '#ffffff';
        }
        break;
        
      default:
        style = '#ffffff';
    }

    // Cache the result
    this.backgroundCache.set(cacheKey, style);
    return style;
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
    
    // Show success message
    alert(`Template saved successfully!`);
  }
  
  // Save template with promise-based image conversion
  async saveTemplateWithImageConversion(): Promise<void> {
    if (!this.template.name || !this.template.type) {
      alert('Please provide a name and type for your template');
      return;
    }
    
    try {
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
      
      // Show success message
      alert(`Template saved successfully!`);
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
    this.filterLayers();
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
    // Use requestAnimationFrame for smooth keyboard movement
    if (this.dragAnimationFrame) {
      cancelAnimationFrame(this.dragAnimationFrame);
    }
    
    this.dragAnimationFrame = requestAnimationFrame(() => {
      if (this.selectedElement !== null) {
        const element = this.canvasElements[this.selectedElement];
        element.x += deltaX;
        element.y += deltaY;
        
        // Apply constraints
        if (this.constrainToCanvas) {
          element.x = Math.max(0, Math.min(element.x, this.canvasWidth - (element.width || 0)));
          element.y = Math.max(0, Math.min(element.y, this.canvasHeight - (element.height || 0)));
        }
        
        if (this.snapToGrid) {
          element.x = Math.round(element.x / this.gridSize) * this.gridSize;
          element.y = Math.round(element.y / this.gridSize) * this.gridSize;
        }
        
        this.updateElementPosition(this.selectedElement);
      } else if (this.selectedElements.length > 0) {
        this.selectedElements.forEach(index => {
          const element = this.canvasElements[index];
          element.x += deltaX;
          element.y += deltaY;
          
          // Apply constraints
          if (this.constrainToCanvas) {
            element.x = Math.max(0, Math.min(element.x, this.canvasWidth - (element.width || 0)));
            element.y = Math.max(0, Math.min(element.y, this.canvasHeight - (element.height || 0)));
          }
          
          if (this.snapToGrid) {
            element.x = Math.round(element.x / this.gridSize) * this.gridSize;
            element.y = Math.round(element.y / this.gridSize) * this.gridSize;
          }
          
          this.updateElementPosition(index);
        });
      }
      
      this.debouncedSave();
      this.dragAnimationFrame = null;
    });
  }

  private updateElementPosition(elementIndex: number): void {
    // Update only the position without full element update for better performance
    const element = this.canvasElements[elementIndex];
    const elementDiv = document.querySelector(`[data-element-index="${elementIndex}"]`) as HTMLElement;
    if (elementDiv && element) {
      elementDiv.style.left = `${element.x}px`;
      elementDiv.style.top = `${element.y}px`;
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
    this.filterLayers();
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
    this.filterLayers();
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

    // Create cache key from gradient properties
    const cacheKey = `${element.id}-${element.textGradientType}-${element.textGradientColor1}-${element.textGradientColor2}-${element.textGradientAngle}`;
    
    // Check cache first
    if (this.gradientCache.has(cacheKey)) {
      return this.gradientCache.get(cacheKey)!;
    }

    const color1 = element.textGradientColor1 || '#000000';
    const color2 = element.textGradientColor2 || '#ffffff';
    const angle = element.textGradientAngle || 0;
    
    let gradient: string;
    if (element.textGradientType === 'linear') {
      gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    } else if (element.textGradientType === 'radial') {
      gradient = `radial-gradient(circle, ${color1}, ${color2})`;
    } else {
      gradient = 'none';
    }

    // Cache the result
    this.gradientCache.set(cacheKey, gradient);
    return gradient;
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

    // Create cache key from all filter properties
    const cacheKey = `${element.id}-${element.brightness}-${element.contrast}-${element.saturation}-${element.hueRotate}-${element.blur}-${element.sepia}-${element.grayscale}-${element.invert}`;
    
    // Check cache first
    if (this.gradientCache.has(cacheKey)) {
      return this.gradientCache.get(cacheKey)!;
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
    
    const result = filterString.trim() || 'none';
    
    // Cache the result
    this.gradientCache.set(cacheKey, result);
    return result;
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

  // Adjust line height
  adjustLineHeight(delta: number): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    const currentLineHeight = element.lineHeight || 1.2;
    const newLineHeight = Math.max(0.5, Math.min(3.0, currentLineHeight + delta));
    element.lineHeight = newLineHeight;
    
    this.updateElement();
  }

  // Adjust letter spacing
  adjustLetterSpacing(delta: number): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    const currentLetterSpacing = element.letterSpacing || 0;
    const newLetterSpacing = Math.max(-5, Math.min(10, currentLetterSpacing + delta));
    element.letterSpacing = newLetterSpacing;
    
    this.updateElement();
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
  
  toggleSmartGuides(): void {
    this.showSmartGuides = !this.showSmartGuides;
  }
  
  toggleSnapToGuides(): void {
    this.snapToGuides = !this.snapToGuides;
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
    this.updateElement();
  }
  
  sendBackward(): void {
    if (this.selectedElement === null || this.selectedElement <= 0) return;
    
    const temp = this.canvasElements[this.selectedElement];
    this.canvasElements[this.selectedElement] = this.canvasElements[this.selectedElement - 1];
    this.canvasElements[this.selectedElement - 1] = temp;
    this.selectedElement--;
    this.saveToHistory();
    this.updateElement();
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
    
    // Handle shift-click for range selection
    if (event.shiftKey && this.lastSelectedElement !== null) {
      const startIndex = Math.min(this.lastSelectedElement, index);
      const endIndex = Math.max(this.lastSelectedElement, index);
      
      // Clear previous selection and select range
      this.selectedElements = [];
      for (let i = startIndex; i <= endIndex; i++) {
        this.selectedElements.push(i);
      }
      this.selectedElement = index;
    } 
    // Handle ctrl/cmd-click for multi-selection
    else if (event.ctrlKey || event.metaKey) {
      if (this.selectedElements.includes(index)) {
        // Remove from selection
        this.selectedElements = this.selectedElements.filter(i => i !== index);
        if (this.selectedElement === index) {
          this.selectedElement = this.selectedElements.length > 0 ? this.selectedElements[0] : null;
        }
      } else {
        // Add to selection
        this.selectedElements.push(index);
        this.selectedElement = index;
      }
    } 
    // Regular single selection
    else {
      this.selectedElement = index;
      this.selectedElements = [];
    }
    
    this.lastSelectedElement = index;
    
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
  
  // Drag and drop layer reordering
  draggedLayerIndex: number | null = null;
  
  // Layer isolation
  isLayerIsolated: boolean = false;
  isolatedLayers: number[] = [];
  
  // Layer search and filtering
  layerSearchQuery: string = '';
  filteredCanvasElements: CanvasElement[] = [];
  
  onLayerDragStart(event: DragEvent, index: number): void {
    this.draggedLayerIndex = index;
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', index.toString());
    
    // Add visual feedback
    const target = event.target as HTMLElement;
    target.style.opacity = '0.5';
  }
  
  onLayerDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    
    // Visual feedback for drop target
    const target = event.target as HTMLElement;
    const layerItem = target.closest('.layer-item') as HTMLElement;
    if (layerItem && this.draggedLayerIndex !== null && this.draggedLayerIndex !== index) {
      layerItem.style.borderTop = '2px solid #007acc';
    }
  }
  
  onLayerDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    
    const draggedIndex = parseInt(event.dataTransfer!.getData('text/plain'));
    
    if (draggedIndex === dropIndex || draggedIndex === null) return;
    
    // Reorder elements array
    const draggedElement = this.canvasElements.splice(draggedIndex, 1)[0];
    this.canvasElements.splice(dropIndex, 0, draggedElement);
    
    // Update selected element index if necessary
    if (this.selectedElement === draggedIndex) {
      this.selectedElement = dropIndex;
    } else if (this.selectedElement !== null) {
      if (draggedIndex < this.selectedElement && dropIndex >= this.selectedElement) {
        this.selectedElement--;
      } else if (draggedIndex > this.selectedElement && dropIndex <= this.selectedElement) {
        this.selectedElement++;
      } else if (this.selectedElement === dropIndex) {
        this.selectedElement = draggedIndex;
      }
    }
    
    // Update selectedElements array
    this.selectedElements = this.selectedElements.map(idx => {
      if (idx === draggedIndex) return dropIndex;
      if (draggedIndex < idx && dropIndex >= idx) return idx - 1;
      if (draggedIndex > idx && dropIndex <= idx) return idx + 1;
      if (idx === dropIndex) return draggedIndex;
      return idx;
    });
    
    this.saveToHistory();
    this.updateElement();
  }
  
  onLayerDragEnd(event: DragEvent): void {
    this.draggedLayerIndex = null;
    
    // Remove visual feedback
    const target = event.target as HTMLElement;
    target.style.opacity = '';
    
    // Remove border styling from all layer items
    const layerItems = document.querySelectorAll('.layer-item');
    layerItems.forEach(item => {
      (item as HTMLElement).style.borderTop = '';
    });
  }
  
  // Layer isolation functionality
  isolateLayer(): void {
    if (this.isLayerIsolated) {
      // Exit isolation mode - show all layers
      this.isLayerIsolated = false;
      this.isolatedLayers.forEach(index => {
        this.canvasElements[index].hidden = false;
      });
      this.isolatedLayers = [];
    } else {
      // Enter isolation mode - hide all except selected layers
      const layersToIsolate = this.selectedElements.length > 0 ? this.selectedElements : 
                             (this.selectedElement !== null ? [this.selectedElement] : []);
      
      if (layersToIsolate.length === 0) return;
      
      this.isLayerIsolated = true;
      this.isolatedLayers = [...layersToIsolate];
      
      // Hide all layers except the isolated ones
      this.canvasElements.forEach((element, index) => {
        if (!layersToIsolate.includes(index)) {
          element.hidden = true;
        }
      });
    }
    
    this.updateElement();
  }
  
  // Layer search and filtering
  filterLayers(): void {
    if (!this.layerSearchQuery.trim()) {
      this.filteredCanvasElements = [...this.canvasElements];
      return;
    }
    
    const query = this.layerSearchQuery.toLowerCase().trim();
    this.filteredCanvasElements = this.canvasElements.filter((element, index) => {
      const layerName = element.layerName || this.getDefaultLayerName(element, index);
      const elementType = element.type;
      
      return layerName.toLowerCase().includes(query) || 
             elementType.toLowerCase().includes(query);
    });
  }
  
  bringToFront(): void {
    if (this.selectedElement === null || this.selectedElement >= this.canvasElements.length - 1) return;
    
    const element = this.canvasElements.splice(this.selectedElement, 1)[0];
    this.canvasElements.push(element);
    this.selectedElement = this.canvasElements.length - 1;
    this.saveToHistory();
    this.filterLayers();
    this.updateElement();
  }
  
  sendToBack(): void {
    if (this.selectedElement === null || this.selectedElement <= 0) return;
    
    const element = this.canvasElements.splice(this.selectedElement, 1)[0];
    this.canvasElements.unshift(element);
    this.selectedElement = 0;
    this.saveToHistory();
    this.filterLayers();
    this.updateElement();
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
    if (this.selectedElement === null) {
      console.warn('No element selected for cropping');
      return;
    }

    const selectedElement = this.canvasElements[this.selectedElement];
    if (!selectedElement || selectedElement.type !== 'image') {
      console.warn('Selected element is not an image');
      return;
    }
    
    if (!selectedElement.src) {
      console.error('No image source found');
      return;
    }
    
    // Reset crop dialog values
    this.currentImageToCrop = { ...selectedElement };
    
    // Set initial crop area to center of image (50% of image size)
    const initialCropRatio = 0.6; // 60% of image
    this.cropWidth = Math.max(100, this.currentImageToCrop.width * initialCropRatio);
    this.cropHeight = Math.max(100, this.currentImageToCrop.height * initialCropRatio);
    this.cropTop = (this.currentImageToCrop.height - this.cropHeight) / 2;
    this.cropLeft = (this.currentImageToCrop.width - this.cropWidth) / 2;
    this.cropAspectRatio = 'free';
    
    this.showCropDialog = true;
  }
  
  closeCropDialog(): void {
    this.showCropDialog = false;
    this.currentImageToCrop = null;
    
    // Reset crop values
    this.cropWidth = 200;
    this.cropHeight = 200;
    this.cropTop = 0;
    this.cropLeft = 0;
    this.cropAspectRatio = 'free';
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
    if (!this.cropAspectRatio || this.cropAspectRatio === 'free' || !this.currentImageToCrop) return;
    
    const [width, height] = this.cropAspectRatio.split(':').map(Number);
    if (!width || !height) return;
    
    const ratio = width / height;
    const imageWidth = this.currentImageToCrop.width;
    const imageHeight = this.currentImageToCrop.height;
    
    // Calculate new dimensions maintaining aspect ratio
    let newWidth = this.cropWidth;
    let newHeight = newWidth / ratio;
    
    // If height exceeds image bounds, adjust based on height
    if (newHeight > imageHeight) {
      newHeight = imageHeight;
      newWidth = newHeight * ratio;
    }
    
    // If width exceeds image bounds, adjust based on width
    if (newWidth > imageWidth) {
      newWidth = imageWidth;
      newHeight = newWidth / ratio;
    }
    
    // Update crop dimensions
    this.cropWidth = Math.round(newWidth);
    this.cropHeight = Math.round(newHeight);
    
    // Ensure crop area stays within image bounds
    if (this.cropLeft + this.cropWidth > imageWidth) {
      this.cropLeft = imageWidth - this.cropWidth;
    }
    if (this.cropTop + this.cropHeight > imageHeight) {
      this.cropTop = imageHeight - this.cropHeight;
    }
    
    // Ensure crop area doesn't go negative
    this.cropLeft = Math.max(0, this.cropLeft);
    this.cropTop = Math.max(0, this.cropTop);
    
    // Validate final boundaries
    this.validateCropBoundaries();
  }

  private validateCropBoundaries(): void {
    if (!this.currentImageToCrop) return;

    const maxWidth = this.currentImageToCrop.width;
    const maxHeight = this.currentImageToCrop.height;

    // Ensure crop area stays within image bounds
    this.cropWidth = Math.max(10, Math.min(this.cropWidth, maxWidth));
    this.cropHeight = Math.max(10, Math.min(this.cropHeight, maxHeight));
    
    // Adjust position if crop area exceeds bounds
    if (this.cropLeft + this.cropWidth > maxWidth) {
      this.cropLeft = maxWidth - this.cropWidth;
    }
    if (this.cropTop + this.cropHeight > maxHeight) {
      this.cropTop = maxHeight - this.cropHeight;
    }
    
    // Ensure position doesn't go negative
    this.cropLeft = Math.max(0, this.cropLeft);
    this.cropTop = Math.max(0, this.cropTop);
  }
  
  applyCrop(): void {
    if (!this.currentImageToCrop || this.selectedElement === null) {
      console.warn('No image to crop or no element selected');
      this.closeCropDialog();
      return;
    }
    
    if (!this.currentImageToCrop.src) {
      console.error('No image source found for cropping');
      this.closeCropDialog();
      return;
    }

    // Validate crop dimensions
    if (this.cropWidth <= 0 || this.cropHeight <= 0) {
      console.error('Invalid crop dimensions');
      return;
    }

    // Validate and fix boundaries before processing
    this.validateCropBoundaries();
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get canvas context for cropping');
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
        const element = this.canvasElements[this.selectedElement];
        element.src = croppedImageDataUrl;
        
        // Update element dimensions to match crop area
        element.width = this.cropWidth;
        element.height = this.cropHeight;
        
        // Update layer name to indicate it's cropped
        if (!element.layerName?.includes('(Cropped)')) {
          element.layerName = `${element.layerName || 'Image'} (Cropped)`;
        }
        
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
  }
  
  generateNewShareLink(): void {
    // In a real app, this would invalidate the old link and create a new one
    this.shareLink = `https://fubaza.com/templates/share/${Date.now()}`;
  }

  // Shape selector methods
  openShapeSelector(): void {
    console.log('openShapeSelector called, isDraggingElement:', this.isDraggingElement);
    // Only open shape selector if not currently dragging
    if (!this.isDraggingElement) {
      this.showShapeSelector = !this.showShapeSelector;
      console.log('showShapeSelector toggled to:', this.showShapeSelector);
    }
  }

  closeShapeSelector(): void {
    console.log('closeShapeSelector called');
    this.showShapeSelector = false;
  }

  triggerImageUpload(): void {
    console.log('triggerImageUpload called');
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        console.log('File selected:', file.name);
        this.handleFileUpload(file);
      }
    };
    
    input.click();
  }

  private handleFileUpload(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      
      // Create image element on canvas using existing method
      const elementId = Date.now().toString();
      const newElement: CanvasElement = {
        id: elementId,
        type: 'image',
        x: 100,
        y: 100,
        width: 200,
        height: 150,
        src: imageUrl,
        layerName: `Image ${this.canvasElements.length + 1}`,
        zIndex: this.canvasElements.length,
        opacity: 1,
        visible: true,
        locked: false
      };
      
      this.canvasElements.push(newElement);
      this.selectedElement = this.canvasElements.length - 1;
      this.updateElement();
      this.filterLayers();
    };
    
    reader.readAsDataURL(file);
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

  // Helper methods for color conversion and utilities
  generateUniqueId(): string {
    return 'element_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

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

  // ========================================
  // ADVANCED TEXT FEATURES IMPLEMENTATION
  // ========================================

  // Font Library Initialization
  initializeFontLibrary(): void {
    this.fontLibrary = [
      // System Fonts
      { name: 'Arial', family: 'Arial, sans-serif', category: 'sans-serif', premium: false, source: 'system' },
      { name: 'Helvetica', family: 'Helvetica, Arial, sans-serif', category: 'sans-serif', premium: false, source: 'system' },
      { name: 'Times New Roman', family: '"Times New Roman", serif', category: 'serif', premium: false, source: 'system' },
      { name: 'Georgia', family: 'Georgia, serif', category: 'serif', premium: false, source: 'system' },
      { name: 'Courier New', family: '"Courier New", monospace', category: 'monospace', premium: false, source: 'system' },
      
      // Google Fonts (Popular ones)
      { name: 'Roboto', family: '"Roboto", sans-serif', category: 'sans-serif', premium: false, source: 'google' },
      { name: 'Open Sans', family: '"Open Sans", sans-serif', category: 'sans-serif', premium: false, source: 'google' },
      { name: 'Montserrat', family: '"Montserrat", sans-serif', category: 'sans-serif', premium: false, source: 'google' },
      { name: 'Lato', family: '"Lato", sans-serif', category: 'sans-serif', premium: false, source: 'google' },
      { name: 'Poppins', family: '"Poppins", sans-serif', category: 'sans-serif', premium: false, source: 'google' },
      { name: 'Source Sans Pro', family: '"Source Sans Pro", sans-serif', category: 'sans-serif', premium: false, source: 'google' },
      
      { name: 'Playfair Display', family: '"Playfair Display", serif', category: 'serif', premium: false, source: 'google' },
      { name: 'Merriweather', family: '"Merriweather", serif', category: 'serif', premium: false, source: 'google' },
      { name: 'Lora', family: '"Lora", serif', category: 'serif', premium: false, source: 'google' },
      
      { name: 'Dancing Script', family: '"Dancing Script", cursive', category: 'handwriting', premium: false, source: 'google' },
      { name: 'Pacifico', family: '"Pacifico", cursive', category: 'handwriting', premium: false, source: 'google' },
      { name: 'Great Vibes', family: '"Great Vibes", cursive', category: 'handwriting', premium: false, source: 'google' },
      
      { name: 'Bebas Neue', family: '"Bebas Neue", cursive', category: 'display', premium: false, source: 'google' },
      { name: 'Oswald', family: '"Oswald", sans-serif', category: 'display', premium: false, source: 'google' },
      { name: 'Anton', family: '"Anton", sans-serif', category: 'display', premium: false, source: 'google' },
      
      // Premium fonts (mock data)
      { name: 'Proxima Nova', family: '"Proxima Nova", sans-serif', category: 'sans-serif', premium: true, source: 'custom' },
      { name: 'Avenir', family: '"Avenir", sans-serif', category: 'sans-serif', premium: true, source: 'custom' },
      { name: 'Brandon Grotesque', family: '"Brandon Grotesque", sans-serif', category: 'display', premium: true, source: 'custom' }
    ];
    
    this.filteredFonts = [...this.fontLibrary];
  }

  // Typography Combos Initialization
  initializeTypographyCombos(): void {
    try {
      this.typographyCombos = [
        {
          id: 'combo-1',
          name: 'Modern Clean',
          headingFont: 'Montserrat',
          bodyFont: 'Open Sans',
          headingText: 'Modern Heading',
          bodyText: 'Clean and professional body text for modern designs',
          category: 'modern'
        },
        {
          id: 'combo-2',
          name: 'Classic Elegant',
          headingFont: 'Playfair Display',
          bodyFont: 'Lora',
          headingText: 'Elegant Title',
          bodyText: 'Sophisticated and readable content with classic styling',
          category: 'elegant'
        },
        {
          id: 'combo-3',
          name: 'Tech Minimal',
          headingFont: 'Roboto',
          bodyFont: 'Source Sans Pro',
          headingText: 'Tech Header',
          bodyText: 'Clean minimal text for technical and digital content',
          category: 'modern'
        },
        {
          id: 'combo-4',
          name: 'Creative Bold',
          headingFont: 'Bebas Neue',
          bodyFont: 'Lato',
          headingText: 'CREATIVE IMPACT',
          bodyText: 'Bold and expressive text for creative projects',
          category: 'bold'
        },
        {
          id: 'combo-5',
          name: 'Luxury Style',
          headingFont: 'Playfair Display',
          bodyFont: 'Montserrat',
          headingText: 'Luxury Brand',
          bodyText: 'Premium quality text for luxury and high-end designs',
          category: 'luxury'
        },
        {
          id: 'combo-6',
          name: 'Sports Dynamic',
          headingFont: 'Bebas Neue',
          bodyFont: 'Roboto',
          headingText: 'SPORTS POWER',
          bodyText: 'Dynamic text perfect for sports and action themes',
          category: 'sports'
        }
      ];
      
      // Initialize filtered combos
      this.filteredTypographyCombos = [...this.typographyCombos];
    } catch (error) {
      console.error('Error initializing typography combos:', error);
      this.typographyCombos = [];
      this.filteredTypographyCombos = [];
    }
  }

  // Text Effect Presets
  initializeTextEffectPresets(): void {
    this.textEffectPresets = [
      {
        id: '1',
        name: 'Drop Shadow',
        type: 'shadow',
        properties: {
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          shadowType: 'drop'
        }
      },
      {
        id: '2',
        name: 'Neon Glow',
        type: 'neon',
        properties: {
          textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
          color: '#ffffff',
          shadowType: 'neon'
        }
      },
      {
        id: '3',
        name: 'Gold Gradient',
        type: 'gradient',
        properties: {
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          webkitBackgroundClip: 'text',
          webkitTextFillColor: 'transparent',
          textGradientType: 'linear',
          textGradientColor1: '#FFD700',
          textGradientColor2: '#FFA500'
        }
      },
      {
        id: '4',
        name: 'Vintage',
        type: 'vintage',
        properties: {
          color: '#8B4513',
          textShadow: '2px 2px 0px #654321',
          filter: 'sepia(0.5)'
        }
      },
      {
        id: '5',
        name: 'Glitch',
        type: 'glitch',
        properties: {
          textShadow: '2px 0 #ff0000, -2px 0 #00ffff',
          animation: 'glitch 0.3s infinite'
        }
      }
    ];
  }

  // Text Animations
  initializeTextAnimations(): void {
    this.textAnimations = [
      { type: 'fadeIn', name: 'Fade In', icon: 'visibility', duration: 1 },
      { type: 'slideUp', name: 'Slide Up', icon: 'keyboard_arrow_up', duration: 0.8 },
      { type: 'slideDown', name: 'Slide Down', icon: 'keyboard_arrow_down', duration: 0.8 },
      { type: 'slideLeft', name: 'Slide Left', icon: 'keyboard_arrow_left', duration: 0.8 },
      { type: 'slideRight', name: 'Slide Right', icon: 'keyboard_arrow_right', duration: 0.8 },
      { type: 'bounce', name: 'Bounce', icon: 'sports_volleyball', duration: 1.2 },
      { type: 'pulse', name: 'Pulse', icon: 'favorite', duration: 1 },
      { type: 'typewriter', name: 'Typewriter', icon: 'keyboard', duration: 2 },
      { type: 'flipX', name: 'Flip X', icon: 'flip', duration: 0.6 },
      { type: 'flipY', name: 'Flip Y', icon: 'flip', duration: 0.6 },
      { type: 'rotateIn', name: 'Rotate In', icon: 'rotate_right', duration: 0.8 },
      { type: 'zoomIn', name: 'Zoom In', icon: 'zoom_in', duration: 0.5 },
      { type: 'elastic', name: 'Elastic', icon: 'timeline', duration: 1.5 }
    ];
  }

  // Load Google Fonts dynamically
  loadGoogleFonts(): void {
    const googleFonts = this.fontLibrary
      .filter(font => font.source === 'google')
      .map(font => font.name.replace(/\s+/g, '+'))
      .join('|');
    
    if (googleFonts) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${googleFonts}:wght@300;400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }

  // Text Element Creation Methods
  addTextElement(type: string): void {
    const textDefaults = this.getTextDefaults(type);
    
    const newElement: CanvasElement = {
      id: `text_${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      width: textDefaults.width,
      height: textDefaults.height,
      content: textDefaults.content,
      fontFamily: textDefaults.fontFamily,
      fontSize: textDefaults.fontSize,
      fontWeight: textDefaults.fontWeight,
      color: textDefaults.color,
      textAlign: 'left',
      textType: type as any,
      lineHeight: 1.2,
      letterSpacing: 0,
      visible: true,
      locked: false
    };

    this.canvasElements.push(newElement);
    this.selectedElement = this.canvasElements.length - 1;
    this.saveToHistory();
    this.filterLayers();
  }

  private getTextDefaults(type: string): any {
    const defaults: { [key: string]: any } = {
      heading: {
        content: 'Add a heading',
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'Montserrat, sans-serif',
        color: '#000000',
        width: 400,
        height: 60
      },
      subheading: {
        content: 'Add a subheading',
        fontSize: 32,
        fontWeight: '600',
        fontFamily: 'Montserrat, sans-serif',
        color: '#333333',
        width: 350,
        height: 45
      },
      body: {
        content: 'Add a little bit of body text',
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Open Sans, sans-serif',
        color: '#666666',
        width: 300,
        height: 100
      },
      caption: {
        content: 'Add a caption',
        fontSize: 12,
        fontWeight: 'normal',
        fontFamily: 'Open Sans, sans-serif',
        color: '#999999',
        width: 200,
        height: 20
      }
    };
    
    return defaults[type] || defaults['body'];
  }

  // Font Management Methods
  filterFonts(): void {
    let filtered = [...this.fontLibrary];
    
    // Filter by category
    if (this.activeFontCategory !== 'all') {
      filtered = filtered.filter(font => font.category === this.activeFontCategory);
    }
    
    // Filter by search query
    if (this.fontSearchQuery.trim()) {
      const query = this.fontSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(font => 
        font.name.toLowerCase().includes(query) ||
        font.category.toLowerCase().includes(query) ||
        font.family?.toLowerCase().includes(query)
      );
    }
    
    this.filteredFonts = filtered;
  }

  setFontCategory(category: string): void {
    this.activeFontCategory = category;
    this.filterFonts();
  }

  applyFont(font: FontItem): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    // Load Google Font if needed
    if (font.source === 'google') {
      this.loadGoogleFont(font.name);
    }
    
    element.fontFamily = font.family;
    this.updateElement();
    this.generateFontPairingSuggestions(font);
  }

  private loadGoogleFont(fontName: string): void {
    // Check if font is already loaded
    const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(fontId)) {
      return; // Font already loaded
    }

    // Create link element for Google Font
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
    
    document.head.appendChild(link);
  }

  isSelectedFont(font: FontItem): boolean {
    if (this.selectedElement === null) return false;
    const element = this.canvasElements[this.selectedElement];
    return element.type === 'text' && element.fontFamily === font.family;
  }

  getFontPreviewStyle(font: FontItem): any {
    return {
      fontFamily: font.family,
      fontSize: '16px'
    };
  }

  // Typography Combo Methods
  applyTypographyCombo(combo: TypographyCombo): void {
    if (!combo) {
      console.error('No typography combo provided');
      return;
    }

    // Create two text elements - heading and body
    const canvasRect = document.querySelector('.canvas')?.getBoundingClientRect();
    if (!canvasRect) {
      console.error('Canvas element not found');
      return;
    }

    // Add heading element
    const headingElement: CanvasElement = {
      id: this.generateUniqueId(),
      type: 'text' as const,
      content: combo.headingText,
      x: 50,
      y: 50,
      width: 300,
      height: 60,
      fontSize: 32,
      fontFamily: combo.headingFont,
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'left' as const,
      opacity: 1,
      layerName: `${combo.name} Heading`
    };

    // Add body element below heading
    const bodyElement: CanvasElement = {
      id: this.generateUniqueId(),
      type: 'text' as const,
      content: combo.bodyText,
      x: 50,
      y: 120,
      width: 400,
      height: 80,
      fontSize: 16,
      fontFamily: combo.bodyFont,
      fontWeight: 'normal',
      color: '#666666',
      textAlign: 'left' as const,
      opacity: 1,
      layerName: `${combo.name} Body`
    };

    // Add both elements to canvas
    this.canvasElements.push(headingElement);
    this.canvasElements.push(bodyElement);

    // Select the heading element
    this.selectedElement = this.canvasElements.length - 2;
    
    // Update layers display
    this.filterLayers();
  }

  getComboHeadingStyle(combo: TypographyCombo): any {
    return {
      fontFamily: this.getFontFamilyWithFallback(combo.headingFont),
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '4px',
      color: '#333333',
      lineHeight: '1.2'
    };
  }

  getComboBodyStyle(combo: TypographyCombo): any {
    return {
      fontFamily: this.getFontFamilyWithFallback(combo.bodyFont),
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#666666',
      lineHeight: '1.4'
    };
  }

  private getFontFamilyWithFallback(fontName: string): string {
    // Ensure proper font family with system fallbacks
    const fontFallbacks: { [key: string]: string } = {
      'Montserrat': '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      'Open Sans': '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      'Playfair Display': '"Playfair Display", Georgia, serif',
      'Lora': '"Lora", Georgia, serif',
      'Roboto': '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      'Source Sans Pro': '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      'Bebas Neue': '"Bebas Neue", Impact, sans-serif',
      'Lato': '"Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    };

    return fontFallbacks[fontName] || `"${fontName}", sans-serif`;
  }

  trackByCombo(index: number, combo: TypographyCombo): string {
    return combo?.id || index.toString();
  }

  setTypographyCategory(category: string): void {
    this.activeTypographyCategory = category;
    this.filterTypographyCombos();
  }

  private filterTypographyCombos(): void {
    if (this.activeTypographyCategory === 'all') {
      this.filteredTypographyCombos = this.typographyCombos;
    } else {
      this.filteredTypographyCombos = this.typographyCombos.filter(
        combo => combo.category === this.activeTypographyCategory
      );
    }
  }

  previewTypographyCombo(combo: TypographyCombo): void {
    this.previewedCombo = combo;
    
    // Optional: Show toast message
    // this.showToast(`Previewing ${combo.name} typography combo`);
  }

  clearAllEffects(): void {
    if (this.selectedElement !== null && this.canvasElements[this.selectedElement]) {
      const element = this.canvasElements[this.selectedElement];
      
      // Clear all text effects
      if (element.type === 'text') {
        element.textShadow = undefined;
        element.textStrokeWidth = undefined;
        element.textStrokeColor = undefined;
        element.filter = undefined;
        element.textGradientType = 'none';
        element.highlightStyle = 'none';
        
        // Reset to default text color
        element.color = '#000000';
        
        this.saveToHistory();
      }
    }
  }

  randomizeEffects(): void {
    if (this.selectedElement !== null && this.canvasElements[this.selectedElement]) {
      const effects = [
        'soft-shadow', 'hard-shadow', 'long-shadow',
        'thin-outline', 'thick-outline', 'double-outline',
        'sunset-gradient', 'ocean-gradient', 'rainbow-gradient',
        'neon-glow', 'soft-glow', 'fire-glow'
      ];
      
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      this.applyTextEffect(randomEffect);
    }
  }

  trackByFont(index: number, font: FontItem): string {
    return font.name;
  }

  // Font Pairing Methods
  generateFontPairingSuggestions(selectedFont: FontItem): void {
    // Generate suggestions based on the selected font
    const pairings = this.getFontPairings(selectedFont);
    this.fontPairingSuggestions = pairings.slice(0, 5); // Show top 5
  }

  private getFontPairings(font: FontItem): FontPairing[] {
    // Simplified pairing logic - in real app, this would be more sophisticated
    const allPairings = [
      {
        id: '1',
        name: 'Modern & Clean',
        primaryFont: 'Montserrat',
        secondaryFont: 'Open Sans',
        primarySample: 'Bold Title',
        secondarySample: 'Supporting text'
      },
      {
        id: '2',
        name: 'Classic & Elegant',
        primaryFont: 'Playfair Display',
        secondaryFont: 'Lora',
        primarySample: 'Elegant Header',
        secondarySample: 'Readable body'
      }
    ];
    
    return allPairings.filter(pairing => 
      pairing.primaryFont === font.name || pairing.secondaryFont === font.name
    );
  }

  applyFontPairing(pairing: FontPairing): void {
    // Apply pairing to selected elements
  }

  getPairingPrimaryStyle(pairing: FontPairing): any {
    return {
      fontFamily: `"${pairing.primaryFont}", sans-serif`,
      fontSize: '16px',
      fontWeight: 'bold'
    };
  }

  getPairingSecondaryStyle(pairing: FontPairing): any {
    return {
      fontFamily: `"${pairing.secondaryFont}", sans-serif`,
      fontSize: '14px',
      fontWeight: 'normal'
    };
  }

  // Color Management Methods
  applyColor(color: string): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    element.color = color;
    this.updateElement();
    this.calculateContrastRatio();
  }

  getCurrentFontStyle(): any {
    if (this.selectedElement === null) return {};
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return {};
    
    return {
      fontFamily: element.fontFamily,
      fontSize: '18px',
      fontWeight: element.fontWeight || 'normal'
    };
  }

  // Font Dropdown Control
  showFontDropdown: boolean = false;

  toggleFontDropdown(): void {
    this.showFontDropdown = !this.showFontDropdown;
  }

  getSelectedFontName(): string {
    if (this.selectedElement === null) return 'Select Font';
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text' || !element.fontFamily) return 'Select Font';
    
    // Find the font in the library
    const font = this.fontLibrary.find(f => f.family === element.fontFamily);
    return font ? font.name : this.extractFontName(element.fontFamily);
  }

  getSelectedFontCategory(): string {
    if (this.selectedElement === null) return '';
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text' || !element.fontFamily) return '';
    
    // Find the font in the library
    const font = this.fontLibrary.find(f => f.family === element.fontFamily);
    return font ? this.formatCategory(font.category) : '';
  }

  private extractFontName(fontFamily: string): string {
    // Extract the first font name from the font-family string
    return fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  }

  private formatCategory(category: string): string {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  selectFont(font: FontItem): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    // Load Google Font if needed
    if (font.source === 'google') {
      this.loadGoogleFont(font.name);
    }
    
    element.fontFamily = font.family;
    this.showFontDropdown = false;
    this.updateElement();
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const fontDropdownContainer = target.closest('.font-dropdown-container');
    
    if (!fontDropdownContainer && this.showFontDropdown) {
      this.showFontDropdown = false;
    }
  }

  // Font Size Adjustment
  adjustFontSize(delta: number): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    const currentSize = element.fontSize || 16;
    const newSize = Math.max(8, Math.min(200, currentSize + delta));
    element.fontSize = newSize;
    this.updateElement();
  }

  // Text Effects Methods
  applyTextEffect(effectType: string): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    switch (effectType) {
      case 'shadow':
        element.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        break;
      case 'outline':
        element.outlineWidth = 1;
        element.outlineColor = '#000000';
        break;
      case 'gradient':
        element.textGradientType = 'linear';
        element.textGradientColor1 = '#FF6B6B';
        element.textGradientColor2 = '#4ECDC4';
        break;
      case 'neon':
        element.textShadow = '0 0 10px #00ffff, 0 0 20px #00ffff';
        element.color = '#ffffff';
        break;
    }
    
    this.updateElement();
  }

  hasEffect(effectType: string): boolean {
    if (this.selectedElement === null) return false;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return false;
    
    switch (effectType) {
      case 'shadow':
        return !!(element.textShadow && element.textShadow !== 'none');
      case 'outline':
        return !!(element.outlineWidth && element.outlineWidth > 0);
      case 'gradient':
        return !!(element.textGradientType && element.textGradientType !== 'none');
      case 'neon':
        return !!(element.textShadow && element.textShadow.includes('0 0'));
      default:
        return false;
    }
  }

  applyTextEffectPreset(preset: TextEffectPreset): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    // Apply preset properties to element
    Object.assign(element, preset.properties);
    this.updateElement();
  }

  getEffectPreviewStyle(preset: TextEffectPreset): any {
    const baseStyle = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      fontWeight: 'bold',
      display: 'inline-block',
      padding: '4px 8px'
    };
    
    return { ...baseStyle, ...preset.properties };
  }

  // Text Shadow Methods
  updateTextShadow(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    const shadowType = element.shadowType || 'none';
    const color = element.shadowColor || 'rgba(0,0,0,0.5)';
    const blur = element.shadowBlur || 4;
    const offsetX = element.shadowOffsetX || 2;
    const offsetY = element.shadowOffsetY || 2;
    
    switch (shadowType) {
      case 'drop':
        element.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
        break;
      case 'inner':
        element.textShadow = `inset ${offsetX}px ${offsetY}px ${blur}px ${color}`;
        break;
      case 'neon':
        element.textShadow = `0 0 ${blur}px ${color}, 0 0 ${blur * 2}px ${color}`;
        break;
      case 'multiple':
        element.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}, ${offsetX * 2}px ${offsetY * 2}px ${blur * 2}px ${color}`;
        break;
      default:
        element.textShadow = 'none';
    }
    
    this.updateElement();
  }

  // Text Outline Methods
  updateTextOutline(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    const width = element.outlineWidth || 0;
    const color = element.outlineColor || '#000000';
    
    if (width > 0) {
      element.textStrokeWidth = width;
      element.textStrokeColor = color;
    } else {
      element.textStrokeWidth = 0;
      element.textStrokeColor = 'transparent';
    }
    
    this.updateElement();
  }

  // Text Curve Methods
  updateTextCurve(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    // This would implement curved text functionality
    // For now, we'll store the curve properties
    this.updateElement();
  }

  // Text Animation Methods
  applyTextAnimation(animation: TextAnimation): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    element.animation = animation.type;
    element.animationDuration = animation.duration;
    element.animationDelay = 0;
    element.animationLoop = false;
    
    this.updateElement();
  }

  updateAnimation(): void {
    if (this.selectedElement === null) return;
    this.updateElement();
  }

  previewAnimation(): void {
    if (this.selectedElement === null) return;
    
    // Trigger animation preview
    const elementDOM = document.querySelector(`[data-element-index="${this.selectedElement}"]`);
    if (elementDOM) {
      elementDOM.classList.add('animate-preview');
      setTimeout(() => {
        elementDOM.classList.remove('animate-preview');
      }, 3000);
    }
  }

  // Smart Text Features
  toggleAutoFit(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    element.autoFit = !element.autoFit;
    this.updateElement();
  }

  toggleTextWrap(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    element.textWrap = !element.textWrap;
    this.updateElement();
  }

  // Text Masking Methods
  enableTextMasking(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    element.maskEnabled = !element.maskEnabled;
    this.updateElement();
  }

  addTextToFrame(): void {
    // Implementation for text as frame functionality
  }

  // AI and Smart Features
  openAIRewrite(): void {
    // Open AI rewrite dialog
  }

  openTranslateText(): void {
    // Open translation dialog
  }

  startVoiceToText(): void {
    // Start voice to text functionality
  }

  addHyperlink(): void {
    // Add hyperlink to text
  }

  // Accessibility Methods
  checkAccessibility(): void {
    this.calculateContrastRatio();
  }

  checkContrastRatio(): void {
    this.calculateContrastRatio();
  }

  private calculateContrastRatio(): void {
    if (this.selectedElement === null) return;
    
    const element = this.canvasElements[this.selectedElement];
    if (element.type !== 'text') return;
    
    const textColor = element.color || '#000000';
    const bgColor = element.backgroundColor || '#ffffff';
    
    this.contrastRatio = this.getContrastRatio(textColor, bgColor);
  }

  private getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgbObject(color1);
    const rgb2 = this.hexToRgbObject(color2);
    
    const l1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Brand Kit Methods
  applyBrandFont(): void {
    // Apply brand font from brand kit
  }

  saveToBrandKit(): void {
    // Save current text style to brand kit
  }

  // Custom Font Upload
  triggerFontUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ttf,.otf,.woff,.woff2';
    input.onchange = (e) => this.onFontFileSelected(e);
    input.click();
  }

  onFontFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (!file) return;
    
    // Handle font file upload
    // In a real implementation, you would upload the font and add it to the font library
  }

  // Font Browser
  openFontBrowser(): void {
    // Open font browser dialog or expand font library
  }

  // Helper method for template
  getOpacityPercentage(): number {
    if (this.selectedElement !== null) {
      return Math.round((this.canvasElements[this.selectedElement].opacity || 1) * 100);
    }
    return 100;
  }

  // Responsive detection and handling
  initializeResponsiveDetection(): void {
    this.updateScreenSize();
    this.detectMobileDevice();
    
    // Listen for window resize
    window.addEventListener('resize', () => {
      this.updateScreenSize();
      this.handleResponsiveLayout();
    });

    // Listen for orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.updateScreenSize();
        this.handleResponsiveLayout();
      }, 100);
    });
  }

  private updateScreenSize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  private detectMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor;
    this.isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) || 
                         window.innerWidth <= 768;
    return this.isMobileDevice;
  }

  private handleResponsiveLayout(): void {
    // Adjust canvas size for mobile
    if (this.screenWidth <= 576) {
      // Mobile layout adjustments
      this.adjustMobileLayout();
    } else if (this.screenWidth <= 768) {
      // Tablet layout adjustments
      this.adjustTabletLayout();
    } else {
      // Desktop layout adjustments
      this.adjustDesktopLayout();
    }
  }

  private adjustMobileLayout(): void {
    // Ensure mobile panel is active
    if (this.activeMobilePanel === 'properties' && this.selectedElement === null) {
      this.activeMobilePanel = 'canvas';
    }
    
    // Optimize zoom for mobile
    if (this.zoomLevel > 100) {
      this.setZoom(75);
    }
  }

  private adjustTabletLayout(): void {
    // Tablet-specific adjustments
    if (this.zoomLevel > 150) {
      this.setZoom(100);
    }
  }

  private adjustDesktopLayout(): void {
    // Desktop-specific adjustments
    // Reset to canvas view on desktop
    this.activeMobilePanel = 'canvas';
  }

  // Enhanced mobile panel management
  toggleMobilePanel(panel: 'sidebar' | 'canvas' | 'properties'): void {
    if (this.activeMobilePanel === panel) {
      // If already active, close it (go to canvas)
      this.activeMobilePanel = 'canvas';
    } else {
      this.activeMobilePanel = panel;
    }
  }

  // Touch gesture support for mobile
  private touchStartX: number = 0;
  private touchStartY: number = 0;

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 1 && this.screenWidth <= 768) {
      const touchCurrentX = event.touches[0].clientX;
      const deltaX = touchCurrentX - this.touchStartX;
      
      // Swipe navigation for mobile
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right - go to previous panel
          this.navigateMobilePanels('prev');
        } else {
          // Swipe left - go to next panel
          this.navigateMobilePanels('next');
        }
        this.touchStartX = touchCurrentX;
      }
    }
  }

  private navigateMobilePanels(direction: 'prev' | 'next'): void {
    const panels: ('sidebar' | 'canvas' | 'properties')[] = ['sidebar', 'canvas', 'properties'];
    const currentIndex = panels.indexOf(this.activeMobilePanel);
    
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % panels.length;
      this.activeMobilePanel = panels[nextIndex];
    } else {
      const prevIndex = currentIndex === 0 ? panels.length - 1 : currentIndex - 1;
      this.activeMobilePanel = panels[prevIndex];
    }

    // Don't allow properties panel if no element selected
    if (this.activeMobilePanel === 'properties' && this.selectedElement === null) {
      this.navigateMobilePanels(direction);
    }
  }

  // Test drag functionality programmatically
  testDragFunctionality(): void {
    console.log('🧪🧪🧪 TESTING DRAG FUNCTIONALITY 🧪🧪🧪');

    // Test 1: Check if elements exist
    console.log('Test 1: Elements check');
    console.log('Canvas elements count:', this.canvasElements.length);
    if (this.canvasElements.length === 0) {
      console.warn('No elements to test drag on. Please add some elements first.');
      return;
    }

    // Test 2: Simulate element selection
    console.log('Test 2: Element selection simulation');
    const testElementIndex = 0;
    const testElement = this.canvasElements[testElementIndex];
    console.log('Testing element:', testElement);

    // Simulate mousedown event
    const mockMouseEvent = {
      clientX: 100,
      clientY: 100,
      button: 0,
      stopPropagation: () => {}
    } as MouseEvent;

    // Test selectElement
    this.selectElement(testElementIndex, mockMouseEvent);
    console.log('After selection - selectedElement:', this.selectedElement);
    console.log('After selection - isDragging:', this.isDragging);

    // Test 3: Simulate drag start
    console.log('Test 3: Drag start simulation');
    this.startElementDrag(testElementIndex, mockMouseEvent);
    console.log('After drag start - drag properties:', {
      isDragging: this.isDragging,
      dragStartX: this.dragStartX,
      dragStartY: this.dragStartY,
      elementStartX: this.elementStartX,
      elementStartY: this.elementStartY
    });

    // Test 4: Simulate mouse move (drag)
    console.log('Test 4: Mouse move simulation');
    const mockMoveEvent = {
      clientX: 150,
      clientY: 150,
      preventDefault: () => {}
    } as MouseEvent;

    // Simulate the mouse move that triggers performOptimizedDragUpdate
    this.onMouseMove(mockMoveEvent);

    // Test 5: Check element position update
    console.log('Test 5: Position update check');
    console.log('Element position after drag:', {
      x: testElement.x,
      y: testElement.y
    });

    // Test 6: Simulate mouse up (end drag)
    console.log('Test 6: Mouse up simulation');
    this.onMouseUp();
    console.log('After mouse up - isDragging:', this.isDragging);
    console.log('Final element position:', {
      x: testElement.x,
      y: testElement.y
    });

    console.log('🧪🧪🧪 DRAG TEST COMPLETED 🧪🧪🧪');

    // Reset selection
    this.selectedElement = null;
    this.selectedElements = [];
  }

  // Getter for safe clip-path calculation
  get cropImageClipPath(): string {
    if (!this.isCropping || !this.currentImageToCrop) {
      return 'none';
    }
    const width = this.currentImageToCrop.width || 0;
    const height = this.currentImageToCrop.height || 0;
    return `inset(${this.cropTop}px ${width - this.cropLeft - this.cropWidth}px ${height - this.cropTop - this.cropHeight}px ${this.cropLeft}px)`;
  }

  // Text editing methods
  startTextEditing(index: number): void {
    this.canvasElements[index].editing = true;
    // Prevent event bubbling to avoid triggering selection
    event?.stopPropagation();
  }

  finishTextEditing(index: number, event: any): void {
    this.canvasElements[index].editing = false;
    if (event.target && event.target.textContent !== undefined) {
      this.canvasElements[index].content = event.target.textContent;
      this.updateElement();
    }
  }
}

