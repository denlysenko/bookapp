import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export const clickOnBtn = (fixture: ComponentFixture<any>, selector = 'button') => {
  const btn = fixture.debugElement.query(By.css(selector)).nativeElement;
  btn.click();
  fixture.detectChanges();
};
