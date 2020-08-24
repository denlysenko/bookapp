import { async, TestBed } from '@angular/core/testing';
import { ViewBookModule } from './view-book.module';

describe('ViewBookModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ViewBookModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ViewBookModule).toBeDefined();
  });
});
