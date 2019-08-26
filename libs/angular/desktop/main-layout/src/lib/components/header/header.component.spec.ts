import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { user } from '@bookapp/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatToolbarModule, MatMenuModule],
      declarations: [HeaderComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.user = user;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggle sidenav', () => {
    beforeEach(() => {
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('.menu-toggler')
      ).nativeElement;

      jest.spyOn(component.toggleSidenav, 'emit');

      button.click();
    });

    it('should emit toggleSidenav event', () => {
      expect(component.toggleSidenav.emit).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      // open menu
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('#user-menu-toggler')
      ).nativeElement;
      button.click();

      const anchor: HTMLAnchorElement = fixture.debugElement.query(
        By.css('#logout')
      ).nativeElement;

      jest.spyOn(component.logout, 'emit');

      anchor.click();
    });

    it('should emit logout event', () => {
      expect(component.logout.emit).toHaveBeenCalled();
    });
  });
});
