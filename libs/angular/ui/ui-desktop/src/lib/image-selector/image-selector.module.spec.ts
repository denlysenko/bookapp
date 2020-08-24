import { async, TestBed } from '@angular/core/testing';
import { ImageSelectorModule } from './image-selector.module';

describe('ImageSelectorModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ImageSelectorModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ImageSelectorModule).toBeDefined();
  });
});
