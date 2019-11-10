import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestBooksPageComponent } from './best-books-page.component';

describe('BestBooksPageComponent', () => {
  let component: BestBooksPageComponent;
  let fixture: ComponentFixture<BestBooksPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestBooksPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestBooksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
