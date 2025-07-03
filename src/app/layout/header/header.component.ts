import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatButtonModule, MatIconModule, NgIf],
  standalone: true
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Input() pageTitle?: string;
  @Input() showBackButton = false;
  
  username = 'Mustafa';
  
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}