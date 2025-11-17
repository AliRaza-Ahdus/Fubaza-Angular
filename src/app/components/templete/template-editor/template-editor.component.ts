import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';
import { TempleteService } from '../../../services/templete.service';
import { Sport, TempleteType } from '../../../models/api-response.model';

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

  constructor(private templeteService: TempleteService) {}

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
      console.error('Error fetching data:', error);
      this.loading = false;
      // Still initialize editor even if data fetch fails
      this.initializeEditor();
    });
  }

  private initializeEditor(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const config: Configuration = {
      license: 'Uf5RWKa8_LjfNhwAVmmye9jjTRvd20YOTs8Sbn4VsDO0RoyqHDuAL2YmaDOdCv5h', // Replace with your actual CE.SDK license key
      theme: 'light',
      //userId: 'guides-user'
       // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.0/assets'
    };

    CreativeEditorSDK.create(this.containerRef.nativeElement, config).then(
      async (instance: any) => {
        this.editorInstance = instance;
        instance.addDefaultAssetSources();
        instance.addDemoAssetSources({
          sceneMode: 'Design',
          withUploadAssetSources: true
        });
        await instance.createDesignScene();
        this.editorLoaded = true;
      }
    );
  }

  onBack(): void {
    window.history.back();
  }

  async onSave(): Promise<void> {
    if (!this.editorInstance) {
      console.error('Editor instance not initialized');
      return;
    }

    try {
      // Get the scene as JSON string
      const sceneString = await this.editorInstance.engine.scene.saveToString();
      debugger;
      // Encode to base64
      const base64 = btoa(sceneString);

      console.log('Template Base64:', base64);
      
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
      const jsonBlob = new Blob([base64], { type: 'text/plain' });
      
      // Prepare FormData for API with files array
      const formData = new FormData();
      formData.append('title', this.templateTitle);
      formData.append('sportId', this.selectedSport);
      formData.append('templeteType', this.selectedTemplate);
      
      // Append files as array
      formData.append('files', jsonBlob, 'template.txt');
      formData.append('files', imageBlob, 'template.png');
      
      // Append documentTypes as array
      formData.append('documentTypes', '1');
      formData.append('documentTypes', '2');

      debugger; 
      // Save to backend
      this.templeteService.addOrUpdateTemplete(formData).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Template saved successfully!');
          } else {
            alert('Error saving template: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error saving template:', error);
          alert('Error saving template. Check console for details.');
        }
      });
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Check console for details.');
    }
  }

  onLoad(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;
        // Decode from base64
        const sceneString = atob(base64);
        debugger;
        if (this.editorInstance) {
          await this.editorInstance.engine.scene.loadFromString(sceneString);
          alert('Template loaded successfully!');
        }
      } catch (error) {
        console.error('Error loading template:', error);
        alert('Error loading template. Check console for details.');
      }
    };
    reader.readAsText(file);
  }

  private downloadBase64(data: string, filename: string): void {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

}
