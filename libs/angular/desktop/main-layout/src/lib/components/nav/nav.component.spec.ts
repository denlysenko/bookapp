import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { By } from '@angular/platform-browser';

import { user } from '@bookapp/testing';

import { NavComponent } from './nav.component';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule],
      declarations: [NavComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add button', () => {
    it('should not display add button if user is not admin', () => {
      component.user = { ...user, roles: ['user'] };
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.add'))).toBeNull();
    });

    it('should display add button if user is admin', () => {
      component.user = { ...user, roles: ['admin'] };
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.add'))).not.toBeNull();
    });
  });
});
