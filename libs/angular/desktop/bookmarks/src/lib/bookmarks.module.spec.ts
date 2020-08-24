import { async, TestBed } from '@angular/core/testing';

import { BookmarksModule } from './bookmarks.module';

describe('BookmarksModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BookmarksModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BookmarksModule).toBeDefined();
  });
});
