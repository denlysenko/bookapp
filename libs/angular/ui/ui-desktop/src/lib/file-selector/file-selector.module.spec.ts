import { async, TestBed } from '@angular/core/testing';
import { FileSelectorModule } from './file-selector.module';

describe('FileSelectorModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FileSelectorModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FileSelectorModule).toBeDefined();
  });
});
