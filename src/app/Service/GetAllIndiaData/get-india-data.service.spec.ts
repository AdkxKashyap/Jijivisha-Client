import { TestBed } from '@angular/core/testing';

import { GetIndiaDataService } from './get-india-data.service';

describe('GetIndiaDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetIndiaDataService = TestBed.get(GetIndiaDataService);
    expect(service).toBeTruthy();
  });
});
