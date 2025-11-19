import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';
import { TempleteService } from '../../../services/templete.service';
import { Sport, TempleteType } from '../../../models/api-response.model';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
})
export class TemplateEditorComponent implements OnInit {
  @ViewChild('cesdk_container', { static: true }) containerRef!: ElementRef;

  title = 'Integrate CreativeEditor SDK with Angular';
  private editorInstance: any;
  private isInitialized = false;

  sportTypes: Sport[] = [];
  templateTypes: TempleteType[] = [];
  selectedSport: string = '';
  selectedTemplate: string = '';
  loading = false;
  editorLoaded = false;
  templateTitle: string = 'New Template';
  showConfirmDialog = false;
  showToast = false;
  toastMessage = '';
  popupVisible = false;
  popupType: 'success' | 'error' = 'success';
  popupMessage = '';
  popupTitle = '';
  popupFadeOut = false;

  constructor(private templeteService: TempleteService, private http: HttpClient) {}

  private showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      this.toastMessage = '';
    }, 3000);
  }

  private showPopup(type: 'success' | 'error', title: string, message: string): void {
    this.popupType = type;
    this.popupTitle = title;
    this.popupMessage = message;
    this.popupVisible = true;
    this.popupFadeOut = false;
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      this.closePopup();
    }, 4000);
  }

  closePopup(): void {
    this.popupFadeOut = true;
    // Wait for animation to complete before hiding
    setTimeout(() => {
      this.popupVisible = false;
      this.popupType = 'success';
      this.popupTitle = '';
      this.popupMessage = '';
      this.popupFadeOut = false;
    }, 300);
  }

  ngOnInit(): void {
    this.loading = true;
    
    // Fetch sports and template types
    Promise.all([
      this.templeteService.getSportsList().toPromise(),
      this.templeteService.getTempleteTypes().toPromise()
    ]).then(([sportsRes, templeteTypesRes]) => {
      this.sportTypes = sportsRes?.data || [];
      this.templateTypes = templeteTypesRes?.data || [];
      
      // Set default selections if available
      if (this.sportTypes.length > 0) {
        this.selectedSport = this.sportTypes[0].id?.toString() || '';
      }
      if (this.templateTypes.length > 0) {
        this.selectedTemplate = this.templateTypes[0].id?.toString() || '';
      }
      
      this.loading = false;
      
      // Now initialize the editor
      this.initializeEditor();
    }).catch((error) => {
      this.loading = false;
      // Still initialize editor even if data fetch fails
      this.initializeEditor();
    });
  }

  private async initializeEditor(): Promise<void> {
  if (this.isInitialized) return;
  this.isInitialized = true;

  const config: Configuration = {
    license: 'Uf5RWKa8_LjfNhwAVmmye9jjTRvd20YOTs8Sbn4VsDO0RoyqHDuAL2YmaDOdCv5h',
    theme: 'light',
    //baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.0/assets'
  };

  const instance = await CreativeEditorSDK.create(this.containerRef.nativeElement, config);
  this.editorInstance = instance;

  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });

  const engine = instance.engine;

  // --------------------------------------------------------------------
  // 🔥 1. FETCHING TEMPLATES FROM API
  // --------------------------------------------------------------------
  const requestBody = {
    sportId: "b1a1cfd3-48b9-43e5-a00b-ff248a623f7a",
    templeteType: 1,
    pageNumber: 1,
    pageSize: 10,
    searchTerm: ""
  };

  const response = await this.templeteService.getTempletesBySport(requestBody).toPromise();
  const items = response?.data?.items ?? [];

  // --------------------------------------------------------------------
  // 🔥 2. CREATE CUSTOM TEMPLATE SOURCE
  // --------------------------------------------------------------------
  await engine.asset.addLocalSource(
    'my-templates',
    undefined,
    async (asset: any): Promise<number | undefined> => {
      try {
        if (!asset.id) {
          throw new Error("Template ID is missing");
        }

        // Fetch template details from API
        const templateData = await this.templeteService.getTempleteById(asset.id).toPromise();
        if (!templateData?.data?.fileUrl) {
          throw new Error("Template file URL not found in API response");
        }

        // Fetch the scene file using Angular HttpClient (avoids CORS issues)
        // Build the full URL with environment.apiUrl
        const fileUrl = `${environment.apiUrl}/${templateData.data.fileUrl}`.replace(/([^:]\/)\/+/g, "$1");
        
        // Fetch the txt file directly as text using fetch API
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        
        const processedScene = await response.text();
        
        if (!processedScene || processedScene.trim() === '') {
          throw new Error("Scene file content is empty");
        }
        
        // Clear existing scene first
        const pages = engine.block.findByType('page');
        for (const pageId of pages) {
          engine.block.destroy(pageId);
        }

        // Load template using processedScene
        await engine.scene.loadFromString(processedScene);

        return undefined;
      } catch (error) {
        throw error; // Re-throw to let CESDK show the error dialog
      }
    }
  );

  // --------------------------------------------------------------------
  // 🔥 3. ADD API TEMPLATES TO SOURCE
  // --------------------------------------------------------------------
  for (const t of items) {
    // Clean up URLs - remove any double slashes
    const thumbUrl = `${environment.apiUrl}/${t.templeteUrl}`.replace(/([^:]\/)\/+/g, "$1");
    const sceneUrl = `${environment.apiUrl}/${t.fileUrl}`.replace(/([^:]\/)\/+/g, "$1");

    engine.asset.addAssetToSource('my-templates', {
      id: t.id,
      label: { en: t.title },
      meta: {
        uri: sceneUrl,           // .txt file with scene data
        thumbUri: thumbUrl       // .png preview image
      }
    });
  }

  // --------------------------------------------------------------------
  // 🔥 4. REGISTER UI ENTRY
  // --------------------------------------------------------------------
  instance.ui.addAssetLibraryEntry({
    id: 'my-templates-entry',
    sourceIds: ['my-templates'],
    sceneMode: 'Design',
    previewLength: 10,
    gridColumns: 2
  });

  // --------------------------------------------------------------------
  // 🔥 5. ADD TAB IN LEFT DOCK (Keep all default tabs + add custom)
  // --------------------------------------------------------------------
  instance.ui.setDockOrder([
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'my-templates-dock',
      label: 'Templates',
      icon: '@imgly/Template',
      entries: ['my-templates-entry']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.assetLibrary.images',
      label: 'Images',
      icon: '@imgly/Image',
      entries: ['ly.img.image']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.assetLibrary.uploads',
      label: 'Uploads',
      icon: '@imgly/Upload',
      entries: ['ly.img.upload']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.assetLibrary.text',
      label: 'Text',
      icon: '@imgly/Text',
      entries: ['ly.img.text']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.assetLibrary.shapes',
      label: 'Shapes',
      icon: '@imgly/Shapes',
      entries: ['ly.img.shape', 'ly.img.vectorpath']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.assetLibrary.stickers',
      label: 'Stickers',
      icon: '@imgly/Sticker',
      entries: ['ly.img.sticker']
    },
    
  ]);

  // --------------------------------------------------------------------
  // Load blank scene
  // --------------------------------------------------------------------
  await instance.createDesignScene();
  this.editorLoaded = true;
}


  onBack(): void {
    window.history.back();
  }

  onSave(): void {
    // Validate required fields
    if (!this.templateTitle || this.templateTitle.trim() === '') {
      this.showToastMessage('Please enter a template title.');
      return;
    }
    
    if (!this.selectedSport || this.selectedSport === '') {
      this.showToastMessage('Please select a sport type.');
      return;
    }
    
    if (!this.selectedTemplate || this.selectedTemplate === '') {
      this.showToastMessage('Please select a template type.');
      return;
    }
    
    this.showConfirmDialog = true;
  }

  cancelSave(): void {
    this.showConfirmDialog = false;
  }

  async confirmSave(): Promise<void> {
    this.showConfirmDialog = false;
    
    if (!this.editorInstance) {
      return;
    }

    try {
      // Get the scene as JSON string
      const sceneString = await this.editorInstance.engine.scene.saveToString();
      
      // Export the current page as PNG
      const engine = this.editorInstance.engine;
      const scene = engine.scene.get();
      const pages = engine.block.findByType('page');
      
      if (!pages || pages.length === 0) {
        throw new Error('No page found in the scene');
      }
      
      const pageId = pages[0];
      const imageBlob = await engine.block.export(pageId, 'image/png');
      
      // Create JSON file from base64
      const jsonBlob = new Blob([sceneString], { type: 'text/plain' });
      
      // Prepare FormData for API with files array
      const formData = new FormData();
      formData.append('title', this.templateTitle);
      formData.append('sportId', this.selectedSport);
      formData.append('templeteType', this.selectedTemplate);
      
      // Create safe filename from template title
      const safeTitle = this.templateTitle.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, ' ').trim();
      
      // Append files as array with title-based names
      formData.append('files', jsonBlob, `${safeTitle}.txt`);
      formData.append('files', imageBlob, `${safeTitle}.png`);
      
      // Append documentTypes as array
      formData.append('documentTypes', '1');
      formData.append('documentTypes', '2');

      // Save to backend
      this.templeteService.addOrUpdateTemplete(formData).subscribe({
        next: async (response) => {
          if (response.success) {
            this.showPopup('success', 'Template Saved', 'Template saved successfully!');
            
            // Clear the canvas after successful save
            if (this.editorInstance) {
              await this.editorInstance.createDesignScene();
            }
            
            // Reset template title
            this.templateTitle = 'New Template';
          } else {
            this.showPopup('error', 'Save Failed', 'Error saving template: ' + response.message);
          }
        },
        error: (error) => {
          this.showPopup('error', 'Save Failed', 'Error saving template. Please try again.');
        }
      });
    } catch (error) {
      alert('Error saving template. Please try again.');
    }
  }

  private readBlobAsText(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsText(blob);
    });
  }

}
