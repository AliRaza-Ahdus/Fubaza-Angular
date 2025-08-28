import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TempleteService } from '../../services/templete.service';
import { Templete } from '../../models/api-response.model';



@Injectable({ providedIn: 'root' })
export class TempleteResolver implements Resolve<Templete[]> {
  constructor(private templeteService: TempleteService) {}

  resolve(): Observable<Templete[]> {
    return this.templeteService.getTempletes();
  }
}
