import { TestBed, waitForAsync } from '@angular/core/testing';
import { ImageSelectorModule } from './image-selector.module';

describe('ImageSelectorModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ImageSelectorModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(ImageSelectorModule).toBeDefined();
  });
});
