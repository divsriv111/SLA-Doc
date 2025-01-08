import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  savedChats: any[] = [
    {name: 'SLA for project 1'},
    {name: 'SLA for project 2'},
    {name: 'SLA for project 3'},
  ];
}
