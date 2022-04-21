import { TestBed } from '@angular/core/testing';

import { TreeOfFilesService } from './tree-of-files.service';

describe('TreeOfFilesService', () => {
  let service: TreeOfFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeOfFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
