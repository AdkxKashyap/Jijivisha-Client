import { TestBed } from '@angular/core/testing';

import { GetAllAggDataService } from './get-all-agg-data.service';

describe('GetAllAggDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetAllAggDataService = TestBed.get(GetAllAggDataService);
    expect(service).toBeTruthy();
  });
});
