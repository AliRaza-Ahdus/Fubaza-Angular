import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardResolver } from './components/dashboard/dashboard.resolver';
import { ClubOverviewComponent } from './components/club-overview/club-overview.component';
import { ClubOverviewResolver } from './components/club-overview/club-overview.resolver';
import { PlayerOverviewComponent } from './components/player-overview/player-overview.component';
import { PlayerOverviewResolver } from './components/player-overview/player-overview.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    resolve: {
      data: DashboardResolver
    }
  },
  { 
    path: 'player-overview', 
    component: PlayerOverviewComponent,
    resolve: {
      data: PlayerOverviewResolver
    }
  },
  { 
    path: 'club-overview', 
    component: ClubOverviewComponent,
    resolve: {
      data: ClubOverviewResolver
    }
  },
  { path: 'templates', component: DashboardComponent },
  { path: 'financial', component: DashboardComponent },
  { path: 'user-management', component: DashboardComponent },
  { path: 'media-library', component: DashboardComponent },
  { path: 'notifications', component: DashboardComponent },
  { path: '**', redirectTo: 'dashboard' }
];