import { Injectable } from '@angular/core';
import { Source } from '../../model/source.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  sources: Source[] = [
    {name: 'SLA Document 1'},
    {name: 'SLA Document 2'},
    {name: 'SLA Document 3'},
  ];

  getSources(): Source[] {
    return this.sources;
  }
}
