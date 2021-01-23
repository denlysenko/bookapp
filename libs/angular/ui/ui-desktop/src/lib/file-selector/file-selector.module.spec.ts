import { TestBed, waitForAsync } from '@angular/core/testing';
import { FileSelectorModule } from './file-selector.module';

describe('FileSelectorModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FileSelectorModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(FileSelectorModule).toBeDefined();
  });
});
