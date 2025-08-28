import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TempleteService } from '../../services/templete.service';
import { Sport, SportsListResponse } from '../../models/api-response.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TempleteResolver implements Resolve<Sport[]> {
  constructor(private templeteService: TempleteService) {}

  resolve(): Observable<Sport[]> {
    return this.templeteService.getSportsList().pipe(
      map(response => response.data)
    );
  }
}
