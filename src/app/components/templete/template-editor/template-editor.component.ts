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
  private uploadInProgress = new Set<string>(); // Track uploads to prevent duplicates
  private uploadedAssets = new Set<string>(); // Track successfully uploaded assets
  private deleteInProgress = new Set<string>(); // Track deletes to prevent duplicates

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
  let items: any[] = [];
  
  if (this.selectedSport) {
    const requestBody = {
      sportId: this.selectedSport,
      templeteType: this.selectedTemplate ? parseInt(this.selectedTemplate) : undefined,
      pageNumber: 1,
      pageSize: 10,
      searchTerm: ""
    };

    try {
      const response = await this.templeteService.getTempletesBySport(requestBody).toPromise();
      items = response?.data?.items ?? [];
    } catch (error) {
      // Continue with empty items array
    }
  } else {
    // No sport selected, loading templates without filter
  }

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
  // 🔥 CUSTOM IMAGE UPLOADS SOURCE
  // --------------------------------------------------------------------
await engine.asset.addSource({
  id: 'userUploads',

  // Allow only images including SVG
  getSupportedMimeTypes: () => [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ],

  // Fetch previously uploaded images
  findAssets: async () => {
    try {
      const response = await this.templeteService.getTemplateImages().toPromise();
      const files = response?.data || [];

      const assets = files.map((file: any) => {
        const mimeType = this.getMimeTypeFromFileName(file.fileName);
        const isSvg = mimeType === 'image/svg+xml';

        return {
          id: file.id.toString(),
          label: file.fileName,
          meta: {
            uri: `${environment.apiUrl}/${file.fileUrl}`,
            thumbUri: `${environment.apiUrl}/${file.fileUrl}`,
            mimeType: mimeType,
            blockType: '//ly.img.ubq/graphic',
            fillType: '//ly.img.ubq/fill/image',
            shapeType: '//ly.img.ubq/shape/rect',
            kind: 'image'
          }
        };
      });

      return {
        assets,
        total: assets.length,
        currentPage: 1,
        totalPages: 1,
      };

    } catch (error) {
      return { assets: [], total: 0, currentPage: 1, totalPages: 1 };
    }
  },

  // Handle Upload inside CE.SDK
  addAsset: async (asset: any) => {
    let uniqueId: string | undefined;

    try {
      // Step 1: Get Blob from local temp URL
      const blobUrl = asset.meta?.uri;
      if (!blobUrl) {
        throw new Error('No asset URI to upload');
      }

      const blob = await fetch(blobUrl).then(res => res.blob());

      // Create a unique identifier based on blob size and type
      uniqueId = `${blob.size}-${blob.type}`;

      // Check if this upload is already in progress or completed
      if (this.uploadInProgress.has(uniqueId) || this.uploadedAssets.has(uniqueId)) {
        return; // Skip duplicate upload
      }

      // Mark upload as in progress
      this.uploadInProgress.add(uniqueId);

      // Step 2: Convert to File
      let extension = blob.type.split("/")[1];
      // Handle SVG specially - API expects .svg not .svg+xml
      if (extension === 'svg+xml') {
        extension = 'svg';
      }
      const fileName = `upload_${Date.now()}.${extension}`;
      const file = new File([blob], fileName, { type: blob.type });

      // Step 3: Upload File to Backend
      const uploadRes = await this.templeteService.uploadTemplateImage(file).toPromise();

      if (!uploadRes?.success) throw new Error("Upload failed");

      const result = uploadRes.data;
      const serverUrl = `${environment.apiUrl}/${result.fileUrl}`;

      // Step 4: Replace CE.SDK asset URL with server URL and set proper meta properties
      asset.meta.uri = serverUrl;
      asset.meta.thumbUri = serverUrl;
      asset.label = result.fileName;
      asset.id = result.id;

      // Set proper meta properties based on file type
      const mimeType = blob.type;
      const isSvg = mimeType === 'image/svg+xml';
      asset.meta.mimeType = mimeType;
      asset.meta.blockType = '//ly.img.ubq/graphic';
      asset.meta.fillType = '//ly.img.ubq/fill/image';
      asset.meta.shapeType = '//ly.img.ubq/shape/rect';
      asset.meta.kind = 'image';

      // Step 5: Immediately add to CE browser (only if not already added)
      if (!this.uploadedAssets.has(uniqueId)) {
        engine.asset.addAssetToSource('userUploads', {
          id: asset.id,
          label: asset.label,
          meta: asset.meta
        });
        this.uploadedAssets.add(uniqueId);
      }

      this.showPopup('success', 'Upload Successful', 'Image uploaded successfully!');

    } catch (error) {
      this.showPopup('error', 'Upload Failed', 'Failed to upload image.');
      throw error;
    } finally {
      // Always remove from in-progress set
      if (uniqueId) {
        this.uploadInProgress.delete(uniqueId);
      }
    }
  },

  // Handle Delete inside CE.SDK
  removeAsset: async (asset: any) => {
    try {
      // Check if this delete is already in progress
      if (this.deleteInProgress.has(asset)) {
        return; // Skip duplicate delete
      }

      // Mark delete as in progress
      this.deleteInProgress.add(asset);

      // Call the delete API
      const deleteRes = await this.templeteService.deleteTemplateImage(asset).toPromise();

      if (!deleteRes?.success) {
        throw new Error("Delete failed");
      }

      // Remove from CE.SDK source
      engine.asset.removeAssetFromSource('userUploads', asset);

      // Remove from local tracking if needed
      // Note: We don't have a reverse mapping from asset.id to uniqueId, but that's okay
      // since the asset is removed from the UI and backend

      this.showPopup('success', 'Delete Successful', 'Image deleted successfully!');

    } catch (error) {
      this.showPopup('error', 'Delete Failed', 'Failed to delete image.');
      throw error;
    } finally {
      // Always remove from in-progress set
      this.deleteInProgress.delete(asset.id);
    }
  }
  });

  // Add custom uploads library entry
  instance.ui.addAssetLibraryEntry({
  id: 'myUploadsLibrary',
  sourceIds: ['userUploads'],
  previewLength: 16,
  gridColumns: 4,
  canAdd: true,
  canRemove: true,
  });

  // Add dedicated image replacement entry that prioritizes user uploads
  instance.ui.addAssetLibraryEntry({
  id: 'imageReplacementLibrary',
  sourceIds: ['userUploads', 'ly.img.image'], // User uploads first, then stock images
  previewLength: 5,
  gridColumns: 4,
  canAdd: true, // No upload button in replacement dialog
  canRemove: true, // No delete in replacement dialog
  });

  // Create an alias source with custom display name "MY Images"
  await engine.asset.addSource({
    id: 'MY Images',
    findAssets: async (queryData: any) => {
      // Delegate to userUploads source
      return await engine.asset.findAssets('userUploads', queryData);
    },
    getSupportedMimeTypes: () => [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ]
  });

  // Modify the default image library entry to include user uploads with sections
  try {
    instance.ui.removeAssetLibraryEntry('ly.img.image');
  } catch (e) {
    // Entry might not exist, that's okay
  }
  
  instance.ui.addAssetLibraryEntry({
    id: 'ly.img.image',
    sourceIds: ['MY Images', 'ly.img.image'], // User uploads appear first with "MY Images" label
    previewLength: 5,
    gridColumns: 4,
  });
  // 🔥 5. ADD TAB IN LEFT DOCK (Clean and organized for users)
  // --------------------------------------------------------------------
  instance.ui.setDockOrder([
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'myUploadsLibrary',
      label: 'My Uploads',
      icon: '@imgly/Upload',
      entries: ['myUploadsLibrary']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'my-templates-dock',
      label: 'Templates',
      icon: '@imgly/Template',
      entries: ['my-templates-entry']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'images-dock',
      label: 'Images',
      icon: '@imgly/Image',
      entries: ['ly.img.image'] // Images tab with user uploads first, then stock images
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
    }
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

  onSportChange(): void {
    this.refreshTemplateList();
  }

  onTemplateTypeChange(): void {
    this.refreshTemplateList();
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
            
            // Refresh the template list with retry logic to ensure newly saved template appears
            await this.refreshTemplatesAfterSave();
            
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

  private async refreshTemplatesAfterSave(): Promise<void> {
    const maxRetries = 5;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {

        await this.refreshTemplateList();

        // Check if the template list was successfully refreshed
        // We can add additional validation here if needed

        return; // Success, exit the retry loop

      } catch (error) {

        if (attempt === maxRetries) {
          this.showPopup('error', 'Refresh Warning', 'Template saved but list may not update immediately. Please refresh manually if needed.');
          return;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  private getMimeTypeFromFileName(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'png': return 'image/png';
      case 'jpg': case 'jpeg': return 'image/jpeg';
      case 'gif': return 'image/gif';
      case 'webp': return 'image/webp';
      case 'svg': return 'image/svg+xml';
      default: return 'image/jpeg';
    }
  }

  private async refreshTemplateList(): Promise<void> {
    if (!this.editorInstance) return;

    const engine = this.editorInstance.engine;
    const instance = this.editorInstance;

    if (!this.selectedSport) {
      return;
    }

    try {
      
      // STEP 1: FETCH FRESH TEMPLATES FIRST
      const requestBody = {
        sportId: this.selectedSport,
        templeteType: this.selectedTemplate ? parseInt(this.selectedTemplate) : undefined,
        pageNumber: 1,
        pageSize: 100,
        searchTerm: "",
        _t: Date.now()
      };

      const response = await this.templeteService.getTempletesBySport(requestBody).toPromise();
      const freshItems = response?.data?.items ?? [];

      // STEP 2: COMPLETELY REMOVE OLD SOURCE AND ALL REFERENCES
      
      // Remove UI entry first
      try {
        instance.ui.unstable_removeAssetLibraryEntry('my-templates-entry');
      } catch (e) {
        // Entry might not exist, that's okay
      }

      // Remove the asset source completely
      try {
        await engine.asset.removeSource('my-templates');
      } catch (e) {
        // Source might not exist, that's okay
        // Try alternative approach - clear all assets from the source
        try {
          const existingAssets = await engine.asset.findAssets('my-templates', {});
          for (const asset of existingAssets.assets || []) {
            try {
              await engine.asset.removeAssetFromSource('my-templates', asset.id);
            } catch (removeError) {
              // Could not remove asset
            }
          }
        } catch (clearError) {
          // Could not clear existing assets
        }
      }

      // Wait for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // STEP 3: CREATE OR UPDATE SOURCE
      try {
        // Try to create the source (it might already exist)
        await engine.asset.addLocalSource(
          'my-templates',
          undefined,
          async (asset: any): Promise<number | undefined> => {
            try {
              if (!asset.id) throw new Error("Template ID is missing");

              const templateData = await this.templeteService.getTempleteById(asset.id).toPromise();
              if (!templateData?.data?.fileUrl) {
                throw new Error("Template file URL not found");
              }

              const fileUrl = `${environment.apiUrl}/${templateData.data.fileUrl}`.replace(/([^:]\/)\/+/g, "$1");
              const response = await fetch(fileUrl + '?_t=' + Date.now(), {
                cache: 'no-cache',
                headers: { 'Cache-Control': 'no-cache' }
              });

              if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
              }

              const processedScene = await response.text();
              if (!processedScene?.trim()) {
                throw new Error("Scene content is empty");
              }

              const pages = engine.block.findByType('page');
              for (const pageId of pages) {
                engine.block.destroy(pageId);
              }

              await engine.scene.loadFromString(processedScene);
              return undefined;
            } catch (error) {
              throw error;
            }
          }
        );
      } catch (sourceError: any) {
        if (sourceError?.message?.includes('already exists')) {
          // Source already exists, will update assets instead
        } else {
          throw sourceError; // Re-throw if it's a different error
        }
      }

      // STEP 4: POPULATE NEW SOURCE WITH ONLY FRESH TEMPLATES
      const timestamp = Date.now();
      
      for (const t of freshItems) {
        try {
          const thumbUrl = `${environment.apiUrl}/${t.templeteUrl}`.replace(/([^:]\/)\/+/g, "$1") + '?v=' + timestamp;
          const sceneUrl = `${environment.apiUrl}/${t.fileUrl}`.replace(/([^:]\/)\/+/g, "$1") + '?v=' + timestamp;

          engine.asset.addAssetToSource('my-templates', {
            id: t.id,
            label: { en: t.title },
            meta: {
              uri: sceneUrl,
              thumbUri: thumbUrl
            }
          });
        } catch (err) {
          // Failed to add asset
        }
      }

      // STEP 5: ADD NEW UI ENTRY
      instance.ui.addAssetLibraryEntry({
        id: 'my-templates-entry',
        sourceIds: ['my-templates'],
        sceneMode: 'Design',
        previewLength: 10,
        gridColumns: 2
      });

      // Ensure professional images library entry exists
      try {
        instance.ui.removeAssetLibraryEntry('professionalImagesLibrary');
      } catch (e) {
        // Entry might not exist, that's okay
      }
      instance.ui.addAssetLibraryEntry({
        id: 'professionalImagesLibrary',
        sourceIds: ['userUploads', 'ly.img.image'], // User uploads first
        previewLength: 24,
        gridColumns: 4,
        canAdd: false,
        canRemove: false,
      });

      // Update the default image library to prioritize user uploads
      try {
        instance.ui.removeAssetLibraryEntry('ly.img.image');
      } catch (e) {
        // Entry might not exist, that's okay
      }
      instance.ui.addAssetLibraryEntry({
        id: 'ly.img.image',
        sourceIds: ['userUploads', 'ly.img.image'], // User uploads appear first
        previewLength: 24,
        gridColumns: 4,
      });

      // STEP 6: FORCE UI REFRESH WITH CLEAN DOCK ORDER
      instance.ui.setDockOrder([
        {
          id: 'ly.img.assetLibrary.dock',
          key: 'myUploadsLibrary',
          label: 'My Uploads',
          icon: '@imgly/Upload',
          entries: ['myUploadsLibrary']
        },
        {
          id: 'ly.img.assetLibrary.dock',
          key: 'my-templates-dock',
          label: 'Templates',
          icon: '@imgly/Template',
          entries: ['my-templates-entry']
        },
        {
          id: 'ly.img.assetLibrary.dock',
          key: 'images-dock',
          label: 'Images',
          icon: '@imgly/Image',
          entries: ['ly.img.image'] // Images tab with user uploads first, then stock images
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
        }
      ]);
    } catch (error) {
      // Error during template refresh
    }
  }

}
