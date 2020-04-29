import { TestBed } from '@angular/core/testing';

import { GetLatestNewsService } from './get-latest-news.service';

describe('GetLatestNewsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetLatestNewsService = TestBed.get(GetLatestNewsService);
    expect(service).toBeTruthy();
  });
});
