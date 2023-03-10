import { TestBed } from '@angular/core/testing';

import { AppconfigService } from './appconfig.service';

describe('AppconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppconfigService = TestBed.get(AppconfigService);
    expect(service).toBeTruthy();
  });
});
