import { Component, Input } from '@angular/core';
import { ChatService } from '../../core/services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-file-preview',
  imports: [CommonModule, CardModule],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.scss'
})
export class FilePreviewComponent {
  @Input() id: string = '';
  extractedJSON: any = null;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.extractJSON(this.id).subscribe(response => {
      console.log('JSON response ', response);
      this.extractedJSON = response;
    });
  }

}
