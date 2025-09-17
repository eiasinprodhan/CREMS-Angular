import { TestBed } from '@angular/core/testing';

import { LoanpaymentService } from './loanpayment.service';

describe('LoanpaymentService', () => {
  let service: LoanpaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanpaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
