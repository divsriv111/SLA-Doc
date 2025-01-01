import { Component, ViewEncapsulation } from '@angular/core';
import { SLAData } from './models/SLAData';
import { NotebooklmService } from './services/notebooklm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  selectedFiles: File[] = [];
  slaDataList: SLAData[] = [];

  constructor(private notebooklmService: NotebooklmService) {}

  // Handler called by PrimeNG's upload component
  onFileSelect(event: any) {
    // This event contains the array of selected File objects
    // If you have "uploadHandler" in the p-fileUpload, event.files is an array
    this.selectedFiles = event.files;
  }

  processDocuments() {
    // Pass the selected PDFs to the backend for analysis
    this.notebooklmService.uploadAndProcessPDFs(this.selectedFiles).subscribe(
      (result: SLAData[]) => {
        this.slaDataList = result; // set the table data with the results
      },
      (error: any) => {
        console.error('Error processing documents:', error);
      }
    );
  }
}
