import { Component } from '@angular/core';
import { SourceListComponent } from '../source-list/source-list.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-chat-room',
  imports: [SourceListComponent, ChatComponent],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent {

}
