import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SLAData } from '../models/SLAData';

@Injectable({
  providedIn: 'root',
})
export class NotebooklmService {
  private apiUrl = 'http://localhost:5000/api'; // Your backend endpoint

  constructor(private http: HttpClient) {}

  uploadAndProcessPDFs(files: File[]): Observable<SLAData[]> {
    // Prepare form data
    const formData: FormData = new FormData();
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });

    return this.http.post<SLAData[]>(`${this.apiUrl}/upload/extract`, formData);
  }
}
