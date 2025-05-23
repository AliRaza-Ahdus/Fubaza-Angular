import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  standalone: true
})
export class AppComponent implements OnInit {
  sidebarOpen = true;
  private readonly MOBILE_BREAKPOINT = 640;  // sm
  private readonly TABLET_BREAKPOINT = 768;  // md
  private readonly DESKTOP_BREAKPOINT = 1024; // lg
  isDesktop = true;

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
}