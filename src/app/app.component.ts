import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule],
  standalone: true
})
export class AppComponent implements OnInit {
  sidebarOpen = true;
  private readonly MOBILE_BREAKPOINT = 640;  // sm
  private readonly TABLET_BREAKPOINT = 768;  // md
  private readonly DESKTOP_BREAKPOINT = 1024; // lg
  isDesktop = true;
  pageTitle?: string;
  showBackButton = false;
  showLayout = true;

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        
        // Hide layout for template editor
        this.showLayout = !url.includes('/templete-editor');
        
        if (url.startsWith('/club-overview')) {
          this.pageTitle = 'Clubs Overview';
          this.showBackButton = false;
        } else if (url.startsWith('/player-overview')) {
          this.pageTitle = 'Players Overview';
          this.showBackButton = false;
        } else if (url.startsWith('/player-detail')) {
          this.pageTitle = 'Player Profile';
          this.showBackButton = true;
        } else if (url.startsWith('/club-detail')) {
          this.pageTitle = 'Club Profile';
          this.showBackButton = true;
        } else {
          this.pageTitle = undefined;
          this.showBackButton = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  private checkScreenSize(): void {
    const width = window.innerWidth;
    this.isDesktop = width >= this.DESKTOP_BREAKPOINT;
    if (width < this.MOBILE_BREAKPOINT) {
      this.sidebarOpen = false;
    } else if (width >= this.DESKTOP_BREAKPOINT) {
      this.sidebarOpen = true;
    }
  }

  onBack(): void {
    this.location.back();
  }
}