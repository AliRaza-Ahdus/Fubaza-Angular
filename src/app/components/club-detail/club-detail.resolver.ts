import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClubOverviewService } from '../../services/club-overview.service';
import { ClubInfoResponse } from '../../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ClubDetailResolver implements Resolve<Observable<any>> {
  constructor(private clubOverviewService: ClubOverviewService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const clubId = route.paramMap.get('id')!;

    return this.clubOverviewService.getClubInfo(clubId);
    
  }
} 