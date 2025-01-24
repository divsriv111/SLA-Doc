import { Component, OnInit, Inject, PLATFORM_ID, Input, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
  private isBrowser: boolean;
  private isPdfJsLoaded = false;
  private pendingPdfUrl: string | null = null;
  @Input() pdfId: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadPdfJsScript();
    }
  }

  private loadPdfJsScript() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
    script.onload = () => {
      this.isPdfJsLoaded = true;
      if (this.pdfId) {
        this.loadPdf(`https://prod-upload-langchain.fly.dev/download/${this.pdfId}`);
      }
    };
    document.body.appendChild(script);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pdfId']?.currentValue && 
        changes['pdfId'].currentValue !== changes['pdfId'].previousValue) {
      if (this.isBrowser && this.isPdfJsLoaded) {
        const url = `https://prod-upload-langchain.fly.dev/download/${this.pdfId}`;
        if (document.getElementById('pdf-container')) {
          document.getElementById('pdf-container')!.innerHTML = '';
        }
        this.loadPdf(url);
      }
    }
  }

  ngOnInit(): void {
    // PDF.js loading is now handled in constructor
    if (this.isBrowser && this.pdfId && this.isPdfJsLoaded) {
      const url = `https://prod-upload-langchain.fly.dev/download/${this.pdfId}`;
      this.loadPdf(url);
    }
  }

  loadPdf(url: string): void {
    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    (window as any).pdfjsLib.getDocument(url).promise.then((pdf: any) => {
      // Loop through all the pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        this.renderPage(pdf, pageNum);
      }
    });
  }

  renderPage(pdf: any, pageNum: number): void {
    pdf.getPage(pageNum).then((page: any) => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale: scale });

      // Create canvas for each page
      const canvas = document.createElement('canvas');
      canvas.id = 'pdf-canvas-' + pageNum;
      document.getElementById('pdf-container')?.appendChild(canvas);
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render the PDF page into the canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  }
}
