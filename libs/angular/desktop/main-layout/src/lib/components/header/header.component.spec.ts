import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { user } from '@bookapp/testing/angular';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', user);
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

      const anchor: HTMLAnchorElement = fixture.debugElement.query(By.css('#logout')).nativeElement;

      jest.spyOn(component.logout, 'emit');

      anchor.click();
    });

    it('should emit logout event', () => {
      expect(component.logout.emit).toHaveBeenCalled();
    });
  });

  describe('toggle mode', () => {
    beforeEach(() => {
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('.theme-switcher')
      ).nativeElement;

      jest.spyOn(component.toggleMode, 'emit');

      button.click();
    });

    it('should emit toggleMode event with system theme', () => {
      const systemButton = fixture.debugElement.query(By.css('[data-testid="system-theme"]'));
      systemButton.nativeElement.click();
      expect(component.toggleMode.emit).toHaveBeenCalledWith('auto');
    });

    it('should emit toggleMode event with light theme', () => {
      const lightButton = fixture.debugElement.query(By.css('[data-testid="light-theme"]'));
      lightButton.nativeElement.click();
      expect(component.toggleMode.emit).toHaveBeenCalledWith('light');
    });

    it('should emit toggleMode event with dark theme', () => {
      const darkButton = fixture.debugElement.query(By.css('[data-testid="dark-theme"]'));
      darkButton.nativeElement.click();
      expect(component.toggleMode.emit).toHaveBeenCalledWith('dark');
    });
  });
});
