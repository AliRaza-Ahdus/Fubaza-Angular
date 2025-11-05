import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardResolver } from './components/dashboard/dashboard.resolver';
import { ClubOverviewComponent } from './components/club-overview/club-overview.component';
import { ClubOverviewResolver } from './components/club-overview/club-overview.resolver';
import { PlayerOverviewComponent } from './components/player-overview/player-overview.component';
import { PlayerOverviewResolver } from './components/player-overview/player-overview.resolver';
import { ClubDetailComponent } from './components/club-detail/club-detail.component';
import { PlayerDetailComponent } from './components/player-detail/player-detail.component';
import { PlayerDetailResolver } from './components/player-detail/player-detail.resolver';
import { ClubDetailResolver } from './components/club-detail/club-detail.resolver';
import { ListTempleteComponent } from './components/templete/list-templete/list-templete.component';
import { EditorTempleteComponent } from './components/templete/editor-templete/editor-templete.component';
import { AddupdateTempleteComponent } from './components/templete/addupdate-templete/addupdate-templete.component';

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
  { 
    path: 'club-detail/:id',
    component: ClubDetailComponent,
    resolve: {
      data: ClubDetailResolver
    }
  },
  { 
    path: 'player-detail/:id',
    component: PlayerDetailComponent,
    resolve: { player: PlayerDetailResolver },
  },
  
  { path: 'list-templete', component: ListTempleteComponent },
  { path: 'templete-editor', component: EditorTempleteComponent },
  { path: 'add-templete', component: AddupdateTempleteComponent },
  { path: 'edit-templete/:id', component: AddupdateTempleteComponent },
  { path: 'financial', component: DashboardComponent },
  { path: 'user-management', component: DashboardComponent },
  { path: 'media-library', component: DashboardComponent },
  { path: 'notifications', component: DashboardComponent },
  { path: '**', redirectTo: 'dashboard' }
];