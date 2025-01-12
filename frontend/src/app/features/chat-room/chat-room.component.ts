import { Component, Input } from '@angular/core';
import { SourceListComponent } from '../source-list/source-list.component';
import { ChatComponent } from '../chat/chat.component';
import { GlobalService } from '../../core/services/global/global.service';
import { ChatService } from '../../core/services/chat/chat.service';

@Component({
  selector: 'app-chat-room',
  imports: [SourceListComponent, ChatComponent],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent {

  constructor(private chatService: ChatService, private globalService: GlobalService) {}

  @Input() set id(value: string) {
    if(value == '0') {
      this.globalService.chatTitle = 'New Chat';
    } else {
      this.chatService.getChatById(value).subscribe(chat => {
        this.globalService.chatTitle = chat.title;
      });
    }
  }

}
