import { Injectable } from '@angular/core';
import { Source } from '../../models/source.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient) { }

  sources: Source[] = [
    {name: 'SLA Document 1'},
    {name: 'SLA Document 2'},
    {name: 'SLA Document 3'},
  ];

  getSources(): Source[] {
    return this.sources;
  }

  getSavedChats(): Observable<any[]> {
    return this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/posts');
  }

  getChatById(id: string): Observable<any> {
    return this.httpClient.get<any[]>(`https://jsonplaceholder.typicode.com/posts/${id}`);
  }
}
