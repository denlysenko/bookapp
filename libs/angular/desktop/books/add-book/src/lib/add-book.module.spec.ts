import { async, TestBed } from '@angular/core/testing';

import { AddBookModule } from './add-book.module';

describe('AddBookModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AddBookModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AddBookModule).toBeDefined();
  });
});
