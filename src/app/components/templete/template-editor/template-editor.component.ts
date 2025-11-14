import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
})
export class TemplateEditorComponent implements AfterViewInit {
  @ViewChild('cesdk_container') containerRef!: ElementRef;

  title = 'Integrate CreativeEditor SDK with Angular';
  private editorInstance: any;

  ngAfterViewInit(): void {
    const config: Configuration = {
      license: 'Uf5RWKa8_LjfNhwAVmmye9jjTRvd20YOTs8Sbn4VsDO0RoyqHDuAL2YmaDOdCv5h', // Replace with your actual CE.SDK license key
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
      // Get the scene as JSON
      const scene = this.editorInstance.engine.scene.get();
      const sceneString = await this.editorInstance.engine.scene.saveToString([scene]);
      const templateJson = JSON.parse(sceneString);
      
      console.log('Template JSON:', templateJson);
      
      // You can also download it as a file
      this.downloadJson(templateJson, 'template.json');
      
      // Or send it to your backend service
      // this.templateService.saveTemplate(templateJson).subscribe(...);
      
      alert('Template saved successfully! Check the console for JSON output.');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Check console for details.');
    }
  }

  private downloadJson(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
