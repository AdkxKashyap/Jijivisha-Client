import { TestBed } from '@angular/core/testing';

import { GetMythbusterService } from './get-mythbuster.service';

describe('GetMythbusterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetMythbusterService = TestBed.get(GetMythbusterService);
    expect(service).toBeTruthy();
  });
});
