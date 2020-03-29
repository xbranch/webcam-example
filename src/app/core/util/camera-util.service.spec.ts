import { TestBed } from '@angular/core/testing';

import { CameraUtilService } from './camera-util.service';

describe('CameraUtilService', () => {
  let service: CameraUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
