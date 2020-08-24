import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'bookapp-infinite-scroll',
  template: `
    <ng-content></ng-content>
    <div #anchor></div>
  `,
})
export class InfiniteScrollComponent implements AfterViewInit, OnDestroy {
  @Output() scrolled = new EventEmitter<void>();

  @ViewChild('anchor') anchor: ElementRef<HTMLElement>;

  private observer: IntersectionObserver;

  ngAfterViewInit() {
    const options = {
      root: null,
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.scrolled.emit();
      }
    }, options);

    this.observer.observe(this.anchor.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
