import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
})
export class TemplateEditorComponent implements AfterViewInit {
  @ViewChild('cesdk_container') containerRef!: ElementRef;

  title = 'Integrate CreativeEditor SDK with Angular';
  private editorInstance: any;

  sportTypes = ['Football', 'Basketball', 'Cricket', 'Tennis'];
  templateTypes = ['Poster', 'Banner', 'Card', 'Flyer'];
  selectedSport = 'Football';
  selectedTemplate = 'Poster';

  ngAfterViewInit(): void {
    const config: Configuration = {
      license: 'Uf5RWKa8_LjfNhwAVmmye9jjTRvd20YOTs8Sbn4VsDO0RoyqHDuAL2YmaDOdCv5h', // Replace with your actual CE.SDK license key
      theme: 'dark',
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
      }
    );
  }

  async onSave(): Promise<void> {
    if (!this.editorInstance) {
      console.error('Editor instance not initialized');
      return;
    }

    try {
      // Get the scene as JSON string
      const sceneString = await this.editorInstance.engine.scene.saveToString();
      
      // Encode to base64
      const base64 = btoa(sceneString);
      
      console.log('Template Base64:', base64);
      
      // Download as base64 text
      this.downloadBase64(base64, 'template.txt');
      
      alert('Template saved successfully! Check the console for Base64 output.');
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
