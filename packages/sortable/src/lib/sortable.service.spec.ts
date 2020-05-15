import { TestBed } from '@angular/core/testing';

import { SortableService } from './sortable.service';

describe('SortableService', () => {
  let service: SortableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
