import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { ChatService } from '../../core/services/chat/chat.service';
import { Pdf } from '../../core/models/pdf.model';

@Component({
  selector: 'app-source-list',
  imports: [ButtonModule, CheckboxModule, CardModule, FileUploadModule],
  templateUrl: './source-list.component.html',
  styleUrl: './source-list.component.scss'
})
export class SourceListComponent {
  @Input() pdfList: Pdf[] = [];
  @Output() onDocChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(public chatService: ChatService) {}

  ngOnInit() {  }

  handleCheckboxChange(event: CheckboxChangeEvent, id: string) {
    if(event.checked){
      this.onDocChange.emit(id);
    }
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.pdfList.push({name: 'New File', id: `new_pdf_${this.pdfList.length+1}`});
    }
    if(this.pdfList.length > 0){
      const {group_id, group_title} = this.pdfList[0];
      const file = event.files[0];
      this.chatService.postPdf(file, group_title, group_id).subscribe({
        next: (response: any) => {
          this.startConversation(response.id);
        },
        error: (error) => {
          console.error('Upload failed', error);
        }
      });
    }
  }

  startConversation(pdf_id: string) {
    this.chatService.initiateConversation(pdf_id).subscribe({
      next: (response) => {
        console.log('Conversation started', response);
      },
      error: (error) => {
        console.error('Failed to start conversation', error);
      }
    });
  }
}
