import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChatService } from '../../core/services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { TabsModule } from 'primeng/tabs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'app-file-preview',
  imports: [
    CommonModule,
    CardModule,
    PdfViewerComponent,
    TabsModule,
    ProgressSpinnerModule,
    Highlight,
  ],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.scss',
})
export class FilePreviewComponent implements OnChanges {
  @Input() id: string = '';
  extractedJSON: string | null = null;
  formattedJSON: string = '';

  constructor(private chatService: ChatService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']?.currentValue !== changes['id']?.previousValue) {
      this.chatService.extractJSON(this.id).subscribe((response) => {
        try {
          const parsedJSON =
            typeof response === 'string' ? JSON.parse(response) : response;
          this.formattedJSON = JSON.stringify(parsedJSON, null, 2);
          this.extractedJSON = this.formattedJSON;
        } catch (e) {
          this.extractedJSON = JSON.stringify(response);
        }
      });
    }
  }

  downloadJSON() {
    if (!this.extractedJSON) return;
    const blob = new Blob([this.extractedJSON], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${this.id}.json`);
    link.click();
    link.remove();
  }
}
