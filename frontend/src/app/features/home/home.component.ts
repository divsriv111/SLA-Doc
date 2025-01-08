import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Chat } from '../../core/models/chat.model';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  savedChats: Chat[] = [
    {id: 1, name: 'SLA for project 1'},
    {id: 2, name: 'SLA for project 2'},
    {id: 3, name: 'SLA for project 3'},
  ];
  
  constructor(public router: Router) {}

  navigateToChat() {
    this.router.navigate(['/chat-room']);
  }
}
