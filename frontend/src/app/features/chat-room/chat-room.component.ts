import { Component, Input } from '@angular/core';
import { SourceListComponent } from '../source-list/source-list.component';
import { ChatComponent } from '../chat/chat.component';
import { GlobalService } from '../../core/services/global/global.service';
import { ChatService } from '../../core/services/chat/chat.service';
import { FilePreviewComponent } from '../file-preview/file-preview.component';
import { Pdf } from '../../core/models/pdf.model';

@Component({
  selector: 'app-chat-room',
  imports: [SourceListComponent, ChatComponent, FilePreviewComponent],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss'
})
export class ChatRoomComponent {
  private _id: string = '';
  pdfList: Pdf[] = [];
  currentDocId: string = '';

  constructor(private chatService: ChatService, private globalService: GlobalService) {}

  @Input() 
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
    this.chatService.getPdfsByGroupId(value).subscribe(pdfs => {
      if(pdfs.length !== 0){
        this.globalService.chatTitle = pdfs[0].group_title;
        this.pdfList = pdfs;
      }
    })
  }

  documentChange(id: string) {
    this.currentDocId = id;
  }

}
