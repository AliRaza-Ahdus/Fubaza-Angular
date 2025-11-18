import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Sport, 
  SportsListResponse, 
  Templete, 
  TempletesListResponse, 
  TempleteRequest,
  TempleteTypesListResponse
} from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class TempleteService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET sports list
  getSportsList(): Observable<SportsListResponse> {
    return this.http.get<SportsListResponse>(`${this.baseUrl}/api/lookup/sports`);
  }

  // GET template types list
  getTempleteTypes(): Observable<TempleteTypesListResponse> {
    return this.http.get<TempleteTypesListResponse>(`${this.baseUrl}/api/lookUp/GetTempleteType`);
  }

  // POST to fetch templates by sport
  getTempletesBySport(request: TempleteRequest): Observable<TempletesListResponse> {
    return this.http.post<TempletesListResponse>(`${this.baseUrl}/api/Templete/Templetes`, request);
  }
  
  // Get template by ID (for edit mode)
  getTempleteById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/Templete/GetTemplete/${id}`);
  }
  
  // Add or update template
  addOrUpdateTemplete(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/Templete/AddOrUpdatedTemplete`, formData);
  }
  
  // Fetch template file content (scene data) from URL
  getTemplateFileContent(fileUrl: string): Observable<string> {
    const fullUrl = `${this.baseUrl}/${fileUrl}`.replace(/([^:]\/)\/+/g, "$1");
    return this.http.get(fullUrl, { responseType: 'text' });
  }

  saveTemplate(payload: any): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  getTemplateById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getTemplatesBySport(sport: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?sport=${sport}`);
  }
}
