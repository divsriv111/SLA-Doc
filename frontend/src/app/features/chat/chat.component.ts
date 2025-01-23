import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { ChatService } from '../../core/services/chat/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [CardModule, TextareaModule, ButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  @Input() id: string = '';
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  conversation: {content: string, id: string, role: 'human'|'ai'}[] = [];
  conversationId: string = '';
  form: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService
  ) {
    this.form = this.fb.group({
      text: ['']
    });
    this.chatService.messageStream$.subscribe({
      next: (chunk) => {
        this.message += chunk;
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: (error) => console.error(error)
    });
  }

  ngOnInit(){
    this.getConversations();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  async send(){
    await this.getConversations();
    const content = this.form.value.text;
    this.conversation.push({content, id: `autoId${this.conversation.length}`, role: 'human'});
    this.form.reset();
    this.message = '';
    setTimeout(() => this.scrollToBottom(), 0);
    await this.getAiAnswer(content);
  }

  getConversations(): Promise<void> {
    return new Promise((resolve) => {
      this.chatService.getConversations(this.id).subscribe({
        next: (conversations) => {
          if(conversations.length > 0) {
            this.conversation = conversations[0].messages;
            this.conversationId = conversations[0].id;
          }
          resolve();
        },
        error: (error) => {
          console.error(error);
          resolve();
        }
      });
    });
  }

  async getAiAnswer(input: string){
    try {
      const response = await this.chatService.getAiAnswer(this.conversationId, {input});
      await this.chatService.processStream(response);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
