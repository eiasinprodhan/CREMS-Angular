import { TestBed } from '@angular/core/testing';

import { StagepaymentService } from './stagepayment.service';

describe('StagepaymentService', () => {
  let service: StagepaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StagepaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
