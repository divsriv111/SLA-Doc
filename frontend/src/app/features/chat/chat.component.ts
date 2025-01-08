import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-chat',
  imports: [CardModule, TextareaModule, ButtonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

}
