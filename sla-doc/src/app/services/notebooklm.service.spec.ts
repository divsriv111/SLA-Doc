import { TestBed } from '@angular/core/testing';

import { NotebooklmService } from './notebooklm.service';

describe('NotebooklmService', () => {
  let service: NotebooklmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotebooklmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
