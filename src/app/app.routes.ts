import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlayerOverviewComponent } from './pages/player-overview/player-overview.component';
import { ClubOverviewComponent } from './pages/club-overview/club-overview.component';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    resolve: {
      data: DashboardResolver
    }
  },
  { path: 'player-overview', component: PlayerOverviewComponent },
  { path: 'club-overview', component: ClubOverviewComponent },
  { path: 'templates', component: DashboardComponent },
  { path: 'financial', component: DashboardComponent },
  { path: 'user-management', component: DashboardComponent },
  { path: 'media-library', component: DashboardComponent },
  { path: 'notifications', component: DashboardComponent },
  { path: '**', redirectTo: 'dashboard' }
];