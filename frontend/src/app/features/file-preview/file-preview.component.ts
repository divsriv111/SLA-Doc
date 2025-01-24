import { Component, Input, SimpleChanges } from '@angular/core';
import { ChatService } from '../../core/services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-file-preview',
  imports: [CommonModule, CardModule, PdfViewerComponent, TabsModule],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.scss'
})
export class FilePreviewComponent {
  @Input() id: string = '';
  extractedJSON: any = null;

  constructor(private chatService: ChatService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && changes['id'].currentValue && changes['id'].currentValue !== changes['id'].previousValue) {
      this.chatService.extractJSON(this.id).subscribe(response => {
        console.log('JSON response ', response);
        this.extractedJSON = response;
      });
    }
  }

}
