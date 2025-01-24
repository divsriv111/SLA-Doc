import { Injectable } from '@angular/core';
import { Source } from '../../models/source.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8000/api';
  private messageSubject = new Subject<string>();
  public messageStream$ = this.messageSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  sources: Source[] = [
    {name: 'SLA Document 1'},
    {name: 'SLA Document 2'},
    {name: 'SLA Document 3'},
  ];

  getSources(): Source[] {
    return this.sources;
  }

  getPdfs(){
    return this.httpClient.get<any[]>(`${this.apiUrl}/pdfs`, { withCredentials: true });
  }

  getPdfById(id: string){
    return this.httpClient.get<any>(`${this.apiUrl}/pdfs/${id}`, { withCredentials: true });
  }

  getChatHistoryByPdf(id: string){
    return this.httpClient.get<any[]>(`${this.apiUrl}/conversations?pdf_id=${id}`, { withCredentials: true });
  }

  extractJSON(id: string){
    return this.httpClient.post(`${this.apiUrl}/pdfs/${id}/extract`, {}, { withCredentials: true });
  }

  initiateConversation(pdf_id: string) {
    return this.httpClient.post(`${this.apiUrl}/conversations?pdf_id=${pdf_id}`, {}, { withCredentials: true });
  }

  getAiAnswer(id: string, input: any) {
    return fetch(`${this.apiUrl}/conversations/${id}/messages?stream=true`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    });
  }

  async processStream(response: Response) {
    const reader = response.body?.getReader();
    if (!reader) return;
    
    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        this.messageSubject.next(chunk);
      }
    } catch (error) {
      console.error('Stream reading error:', error);
      this.messageSubject.error(error);
    }
  }

  postPdf(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.httpClient.post(`${this.apiUrl}/pdfs`, formData, {
      withCredentials: true
    });
  }

}
