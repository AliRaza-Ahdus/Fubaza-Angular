import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface NavItem {
  name: string;
  icon: string;
  route?: string;
  active?: boolean;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, MatIconModule, RouterModule],
  standalone: true
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  overviewExpanded = false;

  navItems: NavItem[] = [
    { name: 'Home', icon: 'home', route: '/dashboard', active: false },
    {
      name: 'Overview',
      icon: 'dashboard',
      active: false,
      children: [
        { name: 'Clubs', icon: 'business', route: '/club-overview', active: false },
        { name: 'Players', icon: 'sports_soccer', route: '/player-overview', active: false }
      ]
    },
    { name: 'Templates', icon: 'description', route: '/templete-editor', active: false },
    { name: 'Revenue', icon: 'credit_card', active: false, },
    { name: 'User Management', icon: 'person', active: false,  },
    { name: 'Media Library', icon: 'photo_library', active: false, }
  ];

  constructor(private router: Router) {
    this.setActiveByRoute(this.router.url);
    this.router.events.subscribe(() => {
      this.setActiveByRoute(this.router.url);
    });
  }

  setActiveByRoute(url: string) {
    this.navItems.forEach(navItem => {
      navItem.active = false;
      if (navItem.children) {
        navItem.children.forEach(child => {
          child.active = false;
          if (child.route && url.startsWith(child.route)) {
            child.active = true;
            if (navItem.name === 'Overview') {
              this.overviewExpanded = true;
            }
          }
        });
      }
      if (navItem.route && url.startsWith(navItem.route)) {
        navItem.active = true;
        if (navItem.name !== 'Overview') {
          this.overviewExpanded = false;
        }
      }
    });
  }

  selectNavItem(item: NavItem, parent?: NavItem): void {
    this.navItems.forEach(navItem => {
      navItem.active = false;
      if (navItem.children) {
        navItem.children.forEach(child => child.active = false);
      }
    });
    if (parent) {
      item.active = true;
      this.overviewExpanded = true;
    } else {
      item.active = true;
      if (item.name !== 'Overview') {
        this.overviewExpanded = false;
      }
    }
  }

  toggleOverview(): void {
    this.overviewExpanded = !this.overviewExpanded;
  }

  isParentActive(item: NavItem): boolean {
    return !!(item.active || (item.children && item.children.some(child => child.active)));
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.toggleSidebarEvent.emit();
  }
}