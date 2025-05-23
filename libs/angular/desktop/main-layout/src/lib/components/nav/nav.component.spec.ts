import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { user } from '@bookapp/testing/angular';

import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add button', () => {
    it('should not display add button if user is not admin', () => {
      fixture.componentRef.setInput('user', { ...user, roles: ['user'] });
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.add'))).toBeNull();
    });

    it('should display add button if user is admin', () => {
      fixture.componentRef.setInput('user', { ...user, roles: ['admin'] });
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.add'))).not.toBeNull();
    });
  });
});
