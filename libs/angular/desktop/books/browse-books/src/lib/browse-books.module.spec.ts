import { TestBed, waitForAsync } from '@angular/core/testing';
import { BrowseBooksModule } from './browse-books.module';

describe('BrowseBooksModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BrowseBooksModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(BrowseBooksModule).toBeDefined();
  });
});
