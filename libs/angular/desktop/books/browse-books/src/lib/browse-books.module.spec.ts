import { async, TestBed } from '@angular/core/testing';
import { BrowseBooksModule } from './browse-books.module';

describe('BrowseBooksModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowseBooksModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BrowseBooksModule).toBeDefined();
  });
});
