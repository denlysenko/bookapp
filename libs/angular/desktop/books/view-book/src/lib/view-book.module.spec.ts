import { TestBed, waitForAsync } from '@angular/core/testing';
import { ViewBookModule } from './view-book.module';

describe('ViewBookModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ViewBookModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(ViewBookModule).toBeDefined();
  });
});
