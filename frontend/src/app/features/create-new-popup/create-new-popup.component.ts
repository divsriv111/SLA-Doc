import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ChatService } from '../../core/services/chat/chat.service';
import { FileUpload } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../core/services/loading/loading.service';

@Component({
  selector: 'app-create-new-popup',
  imports: [ButtonModule, Dialog, InputTextModule, FileUpload, FormsModule],
  templateUrl: './create-new-popup.component.html',
  styleUrl: './create-new-popup.component.scss'
})
export class CreateNewPopupComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSubmit: EventEmitter<string> = new EventEmitter<string>();
  file: any;
  groupTitle: string = '';
  fileName: string = '';

  constructor(private chatService: ChatService, private loadingService: LoadingService) {}

  closePopup() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  create(){
    this.loadingService.show();
    this.chatService.postPdf(this.file, this.groupTitle).subscribe({
      next: (response: any) => {
        console.log('File uploaded successfully', response);
        this.startConversation(response.id, response.group_id);
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('Upload failed', error);
      }
    });
  }

  onUpload(event: any) {
    this.file = event.files[0];
    this.fileName = this.file.name;
  }

  startConversation(pdf_id: string, group_id: string) {
    this.chatService.initiateConversation(pdf_id).subscribe({
      next: (response) => {
        this.loadingService.hide();
        console.log('Conversation started', response);
        this.onSubmit.emit(group_id);
        this.closePopup();
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('Failed to start conversation', error);
      }
    });
  }
}
