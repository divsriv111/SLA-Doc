import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Chat } from '../../core/models/chat.model';
import { ChatService } from '../../core/services/chat/chat.service';
import { CreateNewPopupComponent } from '../create-new-popup/create-new-popup.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CardModule, CreateNewPopupComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  savedChats$: Observable<Chat[]> | undefined;
  visible: boolean = false;
  
  constructor(private router: Router, private chatService: ChatService) {}

  ngOnInit() {
    this.savedChats$ = this.chatService.getSavedChats();
  }

  navigateToChat(id: number) {
    this.router.navigate([`/chat-room/${id}`]);
  }
}
