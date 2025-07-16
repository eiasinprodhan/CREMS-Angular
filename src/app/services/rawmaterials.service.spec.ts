import { TestBed } from '@angular/core/testing';

import { RawmaterialsService } from './rawmaterials.service';

describe('RawmaterialsService', () => {
  let service: RawmaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawmaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
