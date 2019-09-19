import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseBooksPageComponent } from './browse-books-page.component';

describe('BrowseBooksPageComponent', () => {
  let component: BrowseBooksPageComponent;
  let fixture: ComponentFixture<BrowseBooksPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseBooksPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseBooksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
