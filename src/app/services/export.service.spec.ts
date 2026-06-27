import { TestBed } from '@angular/core/testing';

import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose category export methods', () => {
    expect(typeof service.exportCategoriesToPDF).toBe('function');
    expect(typeof service.exportCategoriesToExcel).toBe('function');
  });
});
