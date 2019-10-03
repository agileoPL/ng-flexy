import { TestBed } from '@angular/core/testing';

import { FreezerService } from './freezer.service';

describe('FreezerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreezerService = TestBed.get(FreezerService);
    expect(service).toBeTruthy();
  });
});
