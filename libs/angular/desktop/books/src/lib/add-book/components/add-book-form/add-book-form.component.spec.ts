import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookFormComponent } from './add-book-form.component';

describe('AddBookFormComponent', () => {
  let component: AddBookFormComponent;
  let fixture: ComponentFixture<AddBookFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBookFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
