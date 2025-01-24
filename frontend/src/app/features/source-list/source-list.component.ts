import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { ChatService } from '../../core/services/chat/chat.service';
import { Pdf } from '../../core/models/pdf.model';
import { LoadingService } from '../../core/services/loading/loading.service';

@Component({
  selector: 'app-source-list',
  imports: [ButtonModule, CheckboxModule, CardModule, FileUploadModule],
  templateUrl: './source-list.component.html',
  styleUrl: './source-list.component.scss'
})
export class SourceListComponent {
  @Input() pdfList: Pdf[] = [];
  @Output() onDocChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(public chatService: ChatService, private loadingService: LoadingService) {}

  ngOnInit() {  }

  handleCheckboxChange(event: CheckboxChangeEvent, id: string) {
    if(event.checked){
      this.onDocChange.emit(id);
    }
  }

  onUpload(event: any) {
    if(this.pdfList.length > 0){
      this.loadingService.show()
      const {group_id, group_title} = this.pdfList[0];
      const file = event.files[0];
      this.chatService.postPdf(file, group_title, group_id).subscribe({
        next: (response: any) => {
          this.startConversation(response);
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.loadingService.hide();
        }
      });
    }
  }

  startConversation(pdf: Pdf) {
    this.chatService.initiateConversation(pdf.id).subscribe({
      next: (response) => {
        console.log('Conversation started', response);
        this.pdfList.push(pdf);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Failed to start conversation', error);
        this.loadingService.hide();
      }
    });
  }
}
