import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  overviewExpanded = false;

  navItems: NavItem[] = [
    { name: 'Home', icon: 'home', route: '/dashboard', active: true },
    {
      name: 'Overview',
      icon: 'dashboard',
      active: false,
      children: [
        { name: 'Clubs', icon: 'business', route: '/club-overview', active: false },
        { name: 'Players', icon: 'sports_soccer',  active: false }
      ]
    },
    { name: 'Templates', icon: 'description',  active: false },
    { name: 'Revenue', icon: 'credit_card',  active: false },
    { name: 'User Management', icon: 'person', active: false },
    { name: 'Media Library', icon: 'photo_library', active: false }
  ];

  selectNavItem(item: NavItem, parent?: NavItem): void {
    this.navItems.forEach(navItem => {
      navItem.active = false;
      if (navItem.children) {
        navItem.children.forEach(child => child.active = false);
      }
    });
    if (parent) {
      item.active = true;
    } else {
      item.active = true;
    }
  }

  toggleOverview(): void {
    this.overviewExpanded = !this.overviewExpanded;
  }

  isParentActive(item: NavItem): boolean {
    return !!(item.active || (item.children && item.children.some(child => child.active)));
  }
}