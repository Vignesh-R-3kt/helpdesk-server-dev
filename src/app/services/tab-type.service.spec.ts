import { TestBed } from '@angular/core/testing';

import { TabTypeService } from './tab-type.service';

describe('TabTypeService', () => {
  let service: TabTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
