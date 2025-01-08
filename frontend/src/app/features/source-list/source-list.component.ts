import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-source-list',
  imports: [ButtonModule, CheckboxModule, CardModule],
  templateUrl: './source-list.component.html',
  styleUrl: './source-list.component.scss'
})
export class SourceListComponent {
  items = [
    { name: 'source 1' },
    { name: 'source 2' },
    { name: 'source 3' },
    { name: 'source 4' },
  ]
}
