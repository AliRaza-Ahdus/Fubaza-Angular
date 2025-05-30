import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Template } from '../dashboard.resolver';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  imports: [CommonModule, MatIconModule],
  standalone: true
})
export class TemplatesComponent {
  @Input() templates: Template[] = [];
}