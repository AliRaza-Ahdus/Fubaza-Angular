import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatButtonModule, MatIconModule],
  standalone: true
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  username = 'Mustafa';
  
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}