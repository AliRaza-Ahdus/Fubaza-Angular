import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  name: string;
  icon: string;
  route: string;
  active?: boolean;
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

  navItems: NavItem[] = [
    { name: 'Home', icon: 'home', route: '/dashboard', active: true },
    { name: 'Overview', icon: 'dashboard', route: '/overview' },
    { name: 'Clubs', icon: 'business', route: '/clubs' },
    { name: 'Players', icon: 'sports_soccer', route: '/players' },
    { name: 'Templates', icon: 'description', route: '/templates' },
    { name: 'Financial', icon: 'account_balance', route: '/financial' },
    { name: 'User Management', icon: 'people', route: '/user-management' },
    { name: 'Media Library', icon: 'photo_library', route: '/media-library' }
  ];

  selectNavItem(item: NavItem): void {
    this.navItems.forEach(navItem => {
      navItem.active = (navItem === item);
    });
  }
}