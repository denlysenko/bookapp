import { TestBed, waitForAsync } from '@angular/core/testing';

import { BookmarksModule } from './bookmarks.module';

describe('BookmarksModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BookmarksModule],
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(BookmarksModule).toBeDefined();
  });
});
