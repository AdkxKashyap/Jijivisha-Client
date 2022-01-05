import { TestBed } from '@angular/core/testing';

import { GetLatestPublishedDateService } from './get-latest-published-date.service';

describe('GetLatestPublishedDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetLatestPublishedDateService = TestBed.get(GetLatestPublishedDateService);
    expect(service).toBeTruthy();
  });
});
