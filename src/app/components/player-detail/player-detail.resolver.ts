import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayerOverviewService } from '../../services/player-overview.service';

@Injectable({ providedIn: 'root' })
export class PlayerDetailResolver implements Resolve<any> {
  constructor(private playerOverviewService: PlayerOverviewService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const playerId = route.paramMap.get('id')!;
    return this.playerOverviewService.getPlayerInfo(playerId);
  }
} 