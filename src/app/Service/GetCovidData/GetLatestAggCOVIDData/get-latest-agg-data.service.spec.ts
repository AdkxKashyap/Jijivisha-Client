import { TestBed } from '@angular/core/testing';

import { GetLatestAggDataService } from './get-latest-agg-data.service';

describe('GetLatestAggDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetLatestAggDataService = TestBed.get(GetLatestAggDataService);
    expect(service).toBeTruthy();
  });
});
