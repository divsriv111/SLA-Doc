import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { ChatService } from '../../core/services/chat/chat.service';
import { Upload } from '../../core/models/upload.model';

@Component({
  selector: 'app-source-list',
  imports: [ButtonModule, CheckboxModule, CardModule, FileUploadModule],
  templateUrl: './source-list.component.html',
  styleUrl: './source-list.component.scss'
})
export class SourceListComponent {
  uploadedFiles: Upload[] = [];

  constructor(public chatService: ChatService) {}

  ngOnInit() {
    const savedFiles = this.chatService.getSources();
    this.uploadedFiles = savedFiles.map((file, index) => ({file, id: index+1}));
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push({file, id: this.uploadedFiles.length+1});
    }
  }
}
