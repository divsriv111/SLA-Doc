import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { ChatService } from '../../core/services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { Message } from '../../core/models/message.model';
import { Conversation } from '../../core/models/conversation.model';

@Component({
  selector: 'app-chat',
  imports: [CardModule, TextareaModule, ButtonModule, ReactiveFormsModule, SelectModule, CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @Input() id: string = '';
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  chatHistory: Conversation[] = [];
  conversation: Message[] = [];
  conversationId: string = '';
  form: FormGroup;
  aiResponse: string = '';
  history: any;  

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService
  ) {
    this.form = this.fb.group({
      text: ['']
    });
    this.chatService.messageStream$.subscribe({
      next: (chunk) => {
        this.aiResponse += chunk;
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: (error) => console.error(error)
    });
  }

  async ngOnInit(){
    await this.getChatHistory();
    this.history = this.chatHistory[0];
    this.conversation = this.chatHistory[0].messages;
    this.conversationId = this.chatHistory[0].id;
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  async sendQuery(){
    await this.getChatHistory();
    this.reloadConversation();
    const content = this.form.value.text;
    this.conversation.push({content, id: `autoId${this.conversation.length}`, role: 'human'});
    this.form.reset();
    this.aiResponse = '';
    setTimeout(() => this.scrollToBottom(), 0);
    await this.getAiAnswer(content);
  }

  reloadConversation(){
    const currentHistory = this.chatHistory.find(c => c.id === this.conversationId);
    this.conversation = currentHistory?.messages || [];
    this.history = currentHistory;
  }

  getChatHistory(): Promise<void> {
    return new Promise((resolve) => {
      this.chatService.getChatHistoryByPdf(this.id).subscribe({
        next: (chatHistory) => {
          if(chatHistory.length > 0) {
            this.chatHistory = chatHistory;
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

  addNewChatHistory(){
    this.chatService.initiateConversation(this.id).subscribe(async () => {
      await this.getChatHistory();
      this.history = this.chatHistory[0];
      this.conversation = this.chatHistory[0].messages;
      this.conversationId = this.chatHistory[0].id;
      this.aiResponse = '';
      setTimeout(() => this.scrollToBottom(), 0);
    })
  }

  async handleHistoryChange(event: SelectChangeEvent) {
    await this.getChatHistory();
    this.conversation = event.value.messages;
    this.conversationId = event.value.id;
    this.aiResponse = '';
    setTimeout(() => this.scrollToBottom(), 0);
  }
}
