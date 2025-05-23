import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RatingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should rate', () => {
    const starEl = fixture.debugElement.nativeElement.querySelectorAll('.rating-star')[2];
    starEl.click();
    fixture.detectChanges();
    expect(component.value).toEqual(3);
  });
});
